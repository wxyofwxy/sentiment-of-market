export const VIX_THRESHOLDS = {
  CALM_LIMIT: 20,
  PANIC_LIMIT: 30,
};

export const SENTIMENT_MESSAGES = {
  CALM: "市场情绪：平静，观望为主",
  MODERATE_FEAR: "市场情绪：适度恐慌，可考虑分批加仓",
  EXTREME_FEAR: "市场情绪：极度恐慌，黄金加仓机会",
  UNKNOWN: "正在分析市场数据...",
};

export const RETRY_CONFIG = {
  MAX_RETRIES: 3,
  INITIAL_DELAY_MS: 1000,
};

export const MARKET_INDICES = [
  { id: 'spx', name: '标普 500 (S&P 500)', query: 'S&P 500 index price' },
  { id: 'ndx', name: '纳斯达克 100 (Nasdaq 100)', query: 'Nasdaq 100 index price' },
  { id: 'nvda', name: '英伟达 (NVIDIA)', query: 'NVIDIA stock price' },
  { id: 'googl', name: '谷歌 (Alphabet)', query: 'Alphabet Inc Class A stock price' },
  { id: 'tsla', name: '特斯拉 (Tesla)', query: 'Tesla stock price' },
];