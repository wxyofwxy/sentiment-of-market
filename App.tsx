import React, { useEffect, useState, useCallback } from 'react';
import { DashboardState, SentimentLevel, VixData, MarketTickerItem } from './types';
import { fetchVIXIndex, fetchMarketTicker } from './services/geminiService';
import { VIX_THRESHOLDS } from './constants';
import SentimentBanner from './components/SentimentBanner';
import MarketGrid from './components/MarketGrid';
import SourcesList from './components/SourcesList';

// Icons
const RefreshIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
  </svg>
);

const App: React.FC = () => {
  const [state, setState] = useState<DashboardState>({
    loading: true,
    error: null,
    vixData: null,
    marketData: [],
    sentiment: SentimentLevel.UNKNOWN,
  });

  const determineSentiment = (vix: number): SentimentLevel => {
    if (vix < VIX_THRESHOLDS.CALM_LIMIT) return SentimentLevel.CALM;
    if (vix <= VIX_THRESHOLDS.PANIC_LIMIT) return SentimentLevel.MODERATE_FEAR;
    return SentimentLevel.EXTREME_FEAR;
  };

  const loadData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Parallel execution to save time while satisfying "multiple calls" requirement technically
      const [vixData, marketData] = await Promise.all([
        fetchVIXIndex(),
        fetchMarketTicker()
      ]);

      const sentiment = determineSentiment(vixData.value);
      
      setState({
        loading: false,
        error: null,
        vixData,
        marketData,
        sentiment,
      });
    } catch (err: any) {
      console.error(err);
      setState(prev => ({
        ...prev,
        loading: false,
        error: err.message || "数据获取失败，请稍后重试",
      }));
    }
  }, []);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  return (
    <div className="min-h-screen bg-slate-950 selection:bg-indigo-500/30 pb-20">
       {/* Top Navigation / Header */}
       <div className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
         <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20">
                 V
               </div>
               <div>
                 <h1 className="text-lg md:text-xl font-bold text-white tracking-tight leading-none">
                   VIX/美股综合风向标
                 </h1>
                 <p className="text-xs text-slate-500 font-mono pt-1">Market Sentiment Dashboard</p>
               </div>
            </div>
            <button 
              onClick={loadData}
              disabled={state.loading}
              className="group p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all disabled:opacity-50 border border-slate-700"
              title="刷新数据"
            >
               <div className={`transform transition-transform ${state.loading ? "animate-spin" : "group-hover:rotate-180"}`}>
                 <RefreshIcon />
               </div>
            </button>
         </div>
       </div>

       <main className="max-w-6xl mx-auto px-4 md:px-8 py-8">
          
          {/* Error Banner */}
          {state.error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 flex items-center justify-between">
               <span>⚠️ {state.error}</span>
               <button onClick={loadData} className="px-4 py-1 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-sm transition-colors">重试</button>
            </div>
          )}

          {/* 1. Hero Section: VIX Sentiment */}
          <SentimentBanner 
             sentiment={state.sentiment} 
             vixData={state.vixData} 
             loading={state.loading} 
          />

          {/* 2. Market Grid: Indices and Stocks */}
          <MarketGrid items={state.marketData} loading={state.loading} />

          {/* 3. Sources Footer */}
          {!state.loading && state.vixData && (
             <div className="mt-12 opacity-60 hover:opacity-100 transition-opacity">
                <SourcesList sources={state.vixData.sources} />
             </div>
          )}

       </main>
    </div>
  );
};

export default App;