import React from 'react';
import { SentimentLevel } from '../types';
import { SENTIMENT_MESSAGES } from '../constants';

interface Props {
  level: SentimentLevel;
}

const SentimentIndicator: React.FC<Props> = ({ level }) => {
  let colorClass = "text-slate-400";
  let bgClass = "bg-slate-800";
  let borderColor = "border-slate-700";
  let glowClass = "";

  switch (level) {
    case SentimentLevel.CALM:
      colorClass = "text-emerald-400";
      bgClass = "bg-emerald-950/30";
      borderColor = "border-emerald-500/30";
      glowClass = "shadow-[0_0_30px_-5px_rgba(16,185,129,0.15)]";
      break;
    case SentimentLevel.MODERATE_FEAR:
      colorClass = "text-amber-400";
      bgClass = "bg-amber-950/30";
      borderColor = "border-amber-500/30";
      glowClass = "shadow-[0_0_30px_-5px_rgba(245,158,11,0.15)]";
      break;
    case SentimentLevel.EXTREME_FEAR:
      colorClass = "text-rose-500";
      bgClass = "bg-rose-950/30";
      borderColor = "border-rose-500/30";
      glowClass = "shadow-[0_0_30px_-5px_rgba(244,63,94,0.2)] animate-pulse-slow";
      break;
    default:
      break;
  }

  return (
    <div className={`flex-grow flex flex-col justify-center p-6 rounded-2xl border ${borderColor} ${bgClass} ${glowClass} transition-all duration-500 backdrop-blur-sm`}>
      <h2 className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-3">当前市场情绪分析</h2>
      <p className={`text-xl md:text-2xl font-bold ${colorClass} leading-snug`}>
        {SENTIMENT_MESSAGES[level]}
      </p>
    </div>
  );
};

export default SentimentIndicator;