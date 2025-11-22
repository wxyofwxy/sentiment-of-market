import React from 'react';
import { MarketTickerItem } from '../types';

interface Props {
  items: MarketTickerItem[];
  loading: boolean;
}

const MarketGrid: React.FC<Props> = ({ items, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full mt-8">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-slate-800/50 h-24 rounded-xl animate-pulse border border-slate-700/50"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full mt-8">
      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 ml-1">
        关键市场指标 (Key Indices & Tech)
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => {
          // US Convention: Green (emerald) for up, Red (rose) for down
          const colorClass = item.isPositive ? 'text-emerald-400' : 'text-rose-400';
          const bgClass = item.isPositive ? 'bg-emerald-500/5' : 'bg-rose-500/5';
          const borderClass = item.isPositive ? 'border-emerald-500/20' : 'border-rose-500/20';
          const arrow = item.isPositive ? '↑' : '↓';

          return (
            <div 
              key={item.id} 
              className={`relative overflow-hidden rounded-xl p-5 border ${borderClass} ${bgClass} bg-opacity-50 backdrop-blur-sm transition-all hover:bg-opacity-80`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-slate-200 font-bold text-sm md:text-base">{item.name}</h4>
                  <span className="text-xs text-slate-500 font-mono uppercase tracking-wide">{item.symbol}</span>
                </div>
                <div className={`flex items-center text-sm font-bold ${colorClass} bg-slate-900/40 px-2 py-1 rounded-lg`}>
                   <span className="mr-1">{arrow}</span>
                   {item.changePercent}
                </div>
              </div>
              <div className="mt-3">
                 <span className="text-2xl font-black text-white tracking-tight tabular-nums">
                    {item.price}
                 </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MarketGrid;