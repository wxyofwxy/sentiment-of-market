import React from 'react';

interface Props {
  value: number;
  change: string;
  loading: boolean;
}

const VixDisplay: React.FC<Props> = ({ value, change, loading }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-56 bg-slate-800/30 rounded-2xl border border-slate-700/30 animate-pulse">
        <div className="h-20 w-40 bg-slate-700/50 rounded-lg mb-4"></div>
        <div className="h-8 w-24 bg-slate-700/50 rounded-lg"></div>
      </div>
    );
  }

  const isPositive = change.includes('+');
  const isNegative = change.includes('-');
  
  // Market Logic: High VIX (Red) = Fear, Low VIX (Green) = Calm.
  // However, VIX going UP (Positive change) usually means Fear is increasing (Red).
  // VIX going DOWN (Negative change) usually means Fear is decreasing (Green).
  const changeColor = isPositive ? 'text-rose-400' : (isNegative ? 'text-emerald-400' : 'text-slate-400');
  const changeBg = isPositive ? 'bg-rose-500/10' : (isNegative ? 'bg-emerald-500/10' : 'bg-slate-500/10');
  const arrow = isPositive ? '↑' : (isNegative ? '↓' : '');

  return (
    <div className="flex flex-col items-center justify-center p-8 md:p-10 bg-slate-800/40 rounded-2xl shadow-lg border border-white/5 backdrop-blur-sm transition-all hover:bg-slate-800/50">
      <span className="text-indigo-300 font-semibold tracking-widest text-xs uppercase mb-2">CBOE VIX 指数</span>
      
      <div className="relative">
        <div className="text-7xl md:text-9xl font-black text-white tracking-tighter tabular-nums drop-shadow-2xl">
          {value.toFixed(2)}
        </div>
      </div>

      <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full mt-4 ${changeBg} ${changeColor} font-bold text-lg md:text-xl border border-white/5`}>
        <span>{arrow}</span>
        <span>{change}</span>
        <span className="text-xs opacity-70 font-normal uppercase ml-1">24H 涨跌</span>
      </div>
    </div>
  );
};

export default VixDisplay;