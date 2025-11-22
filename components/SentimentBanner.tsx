import React from 'react';
import { SentimentLevel, VixData } from '../types';
import { SENTIMENT_MESSAGES } from '../constants';

interface Props {
  sentiment: SentimentLevel;
  vixData: VixData | null;
  loading: boolean;
}

const SentimentBanner: React.FC<Props> = ({ sentiment, vixData, loading }) => {
  if (loading) {
    return (
      <div className="w-full rounded-3xl h-48 bg-slate-800/50 animate-pulse border border-slate-700/50 mb-8 flex items-center justify-center">
         <span className="text-slate-500 font-medium">正在分析市场风向...</span>
      </div>
    );
  }

  let theme = {
    bg: "bg-slate-800",
    border: "border-slate-700",
    text: "text-slate-300",
    badge: "bg-slate-700 text-slate-300",
    glow: ""
  };

  switch (sentiment) {
    case SentimentLevel.CALM:
      theme = {
        bg: "bg-gradient-to-r from-emerald-950/80 to-slate-900",
        border: "border-emerald-500/30",
        text: "text-emerald-400",
        badge: "bg-emerald-500/20 text-emerald-300",
        glow: "shadow-[0_0_40px_-10px_rgba(16,185,129,0.2)]"
      };
      break;
    case SentimentLevel.MODERATE_FEAR:
      theme = {
        bg: "bg-gradient-to-r from-amber-950/80 to-slate-900",
        border: "border-amber-500/30",
        text: "text-amber-400",
        badge: "bg-amber-500/20 text-amber-300",
        glow: "shadow-[0_0_40px_-10px_rgba(245,158,11,0.2)]"
      };
      break;
    case SentimentLevel.EXTREME_FEAR:
      theme = {
        bg: "bg-gradient-to-r from-rose-950/80 to-slate-900",
        border: "border-rose-500/30",
        text: "text-rose-400",
        badge: "bg-rose-500/20 text-rose-300",
        glow: "shadow-[0_0_40px_-10px_rgba(244,63,94,0.3)] animate-pulse-slow"
      };
      break;
    default:
        break;
  }

  const vixChangeRaw = vixData?.change || "0%";
  const isVixUp = !vixChangeRaw.includes('-');
  // VIX logic: Up means more fear (Red in US convention? Actually VIX up is usually bad for market, so Red is appropriate for 'Danger' but Green is appropriate for 'Number went up'. Stick to standard US logic: Green = Up, Red = Down).
  // However, for VIX specifically, Green (Up) often implies Market Red (Down). 
  // The user asked for "US Market Convention: Green for gains". So VIX +5% -> Green text. 
  const vixChangeColor = isVixUp ? "text-emerald-400" : "text-rose-400";
  const vixArrow = isVixUp ? "↑" : "↓";

  return (
    <div className={`w-full rounded-3xl p-6 md:p-10 border ${theme.border} ${theme.bg} ${theme.glow} mb-8 relative overflow-hidden transition-all duration-700`}>
      
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none mix-blend-overlay"></div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        
        {/* Main Sentiment Text */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${theme.badge}`}>
              当前信号
            </span>
            <span className="text-xs text-slate-400 font-mono">
              UPDATED: {vixData ? new Date(vixData.timestamp).toLocaleTimeString() : "--:--"}
            </span>
          </div>
          <h2 className={`text-2xl md:text-4xl font-bold ${theme.text} leading-tight mb-2 drop-shadow-lg`}>
            {SENTIMENT_MESSAGES[sentiment]}
          </h2>
          <p className="text-slate-400 text-sm md:text-base max-w-2xl leading-relaxed">
            {vixData?.summary.slice(0, 150)}{vixData?.summary && vixData.summary.length > 150 ? "..." : ""}
          </p>
        </div>

        {/* VIX Big Number */}
        <div className="bg-black/20 rounded-2xl p-6 backdrop-blur-sm border border-white/5 min-w-[180px] text-center">
          <div className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-2">CBOE VIX</div>
          <div className="text-5xl md:text-6xl font-black text-white tracking-tighter tabular-nums">
            {vixData?.value.toFixed(2)}
          </div>
          <div className={`flex items-center justify-center gap-1 mt-2 font-bold ${vixChangeColor}`}>
            <span>{vixArrow}</span>
            <span>{vixData?.change}</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SentimentBanner;