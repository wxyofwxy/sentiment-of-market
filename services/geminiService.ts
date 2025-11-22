import { GoogleGenAI } from "@google/genai";
import { VixData, GroundingSource, MarketTickerItem } from "../types";
import { RETRY_CONFIG, MARKET_INDICES } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Uses exponential backoff to retry the API call.
 */
async function fetchWithRetry<T>(fn: () => Promise<T>, retries = RETRY_CONFIG.MAX_RETRIES, delayMs = RETRY_CONFIG.INITIAL_DELAY_MS): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;
    console.warn(`API call failed, retrying in ${delayMs}ms...`, error);
    await delay(delayMs);
    return fetchWithRetry(fn, retries - 1, delayMs * 2);
  }
}

export const fetchVIXIndex = async (): Promise<VixData> => {
  return fetchWithRetry(async () => {
    const modelId = "gemini-2.5-flash";
    
    const prompt = `
      Using the Google Search tool, find the current real-time CBOE VIX Index value, the daily percentage change, and a brief summary of what is driving market volatility today.
      
      Please write the summary in Chinese (Simplified).
      
      After your natural language summary, strictly append a new line with this exact format:
      ||VIX_VALUE: <number>||
      ||VIX_CHANGE: <string_with_sign>||
      
      Example:
      ||VIX_VALUE: 18.45||
      ||VIX_CHANGE: +2.3%||
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "";
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    const sources: GroundingSource[] = groundingChunks
      .map((chunk: any) => {
        if (chunk.web) {
          return { title: chunk.web.title, uri: chunk.web.uri };
        }
        return null;
      })
      .filter((s: GroundingSource | null): s is GroundingSource => s !== null);

    const valueMatch = text.match(/\|\|VIX_VALUE:\s*([\d\.]+)\|\|/);
    const changeMatch = text.match(/\|\|VIX_CHANGE:\s*([^\s|]+)\|\|/);

    let vixValue = 0;
    let vixChange = "N/A";

    if (valueMatch && valueMatch[1]) {
      vixValue = parseFloat(valueMatch[1]);
    } else {
        // Fallback
        const looseMatch = text.match(/VIX.*?(\d{2}\.\d{2})/i);
        if (looseMatch && looseMatch[1]) {
            vixValue = parseFloat(looseMatch[1]);
        } else {
            throw new Error("Could not parse VIX value from response.");
        }
    }

    if (changeMatch && changeMatch[1]) {
      vixChange = changeMatch[1];
    }

    const cleanSummary = text.replace(/\|\|VIX_VALUE:.*?\|\|/g, "").replace(/\|\|VIX_CHANGE:.*?\|\|/g, "").trim();

    return {
      value: vixValue,
      change: vixChange,
      summary: cleanSummary,
      sources,
      timestamp: Date.now(),
    };
  });
};

export const fetchMarketTicker = async (): Promise<MarketTickerItem[]> => {
  return fetchWithRetry(async () => {
    const modelId = "gemini-2.5-flash";
    
    // Construct a query for all items
    const queryItems = MARKET_INDICES.map(item => item.query).join(", ");
    
    const prompt = `
      Find the current real-time price and daily percentage change for the following: ${queryItems}.
      
      Strictly output the data in this specific line-by-line format for each item (no markdown tables):
      ID|PRICE|CHANGE_PERCENT
      
      Map the IDs as follows:
      S&P 500 -> spx
      Nasdaq 100 -> ndx
      NVIDIA -> nvda
      Alphabet -> googl
      Tesla -> tsla
      
      Example output:
      spx|5430.20|+0.52%
      ndx|19200.50|-0.12%
      nvda|135.20|+2.1%
      
      Ensure the change percent includes the + or - sign.
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "";
    const lines = text.split('\n');
    const results: MarketTickerItem[] = [];

    lines.forEach(line => {
      const parts = line.trim().split('|');
      if (parts.length === 3) {
        const [id, price, change] = parts;
        const config = MARKET_INDICES.find(i => i.id === id.toLowerCase());
        if (config) {
          const isPositive = !change.includes('-');
          results.push({
            id: config.id,
            name: config.name,
            symbol: config.query.split(' ')[0], // Simple symbol extraction
            price,
            changePercent: change,
            isPositive
          });
        }
      }
    });

    // Sort to match the original constant order
    return MARKET_INDICES.map(config => {
       const found = results.find(r => r.id === config.id);
       return found || {
         id: config.id,
         name: config.name,
         symbol: config.query,
         price: "0.00",
         changePercent: "0.00%",
         isPositive: true
       };
    });
  });
};