import React from 'react';
import { GroundingSource } from '../types';

interface Props {
  sources: GroundingSource[];
}

const SourcesList: React.FC<Props> = ({ sources }) => {
  if (sources.length === 0) return null;

  return (
    <div className="mt-6 pt-5 border-t border-slate-700/50">
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        参考来源 (Google Search)
      </h3>
      <ul className="space-y-2.5">
        {sources.map((source, idx) => (
          <li key={idx} className="truncate">
            <a 
              href={source.uri} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs md:text-sm text-indigo-400 hover:text-indigo-300 hover:underline transition-colors flex items-center gap-2 group"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/50 group-hover:bg-indigo-400 shrink-0 transition-colors"></span>
              <span className="truncate opacity-80 group-hover:opacity-100">{source.title}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SourcesList;