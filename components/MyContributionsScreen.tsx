import React, { useState, useEffect } from 'react';
import { getUploadHistory } from '../services/storageService';
import { UploadHistoryItem } from '../types';
import { BackIcon, UploadIcon } from './icons';

interface MyContributionsScreenProps {
  onBack: () => void;
  onNavigateToUpload: () => void;
}

const MyContributionsScreen: React.FC<MyContributionsScreenProps> = ({ onBack, onNavigateToUpload }) => {
  const [history, setHistory] = useState<UploadHistoryItem[]>([]);

  useEffect(() => {
    setHistory(getUploadHistory());
  }, []);

  return (
    <div className="h-full w-full bg-slate-100 dark:bg-slate-900 flex flex-col">
      <header className="p-4 flex-shrink-0 flex items-center gap-4 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm border-b border-slate-300 dark:border-slate-700">
        <button onClick={onBack} aria-label="Go back to profile" className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
          <BackIcon className="w-6 h-6 text-slate-800 dark:text-white" />
        </button>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Contributions</h1>
      </header>

      <main className="flex-grow p-4 md:p-6 overflow-y-auto">
        {history.length > 0 ? (
          <ul className="space-y-4">
            {history.map(item => (
              <li key={item.id} className="bg-white dark:bg-slate-800/50 p-4 rounded-lg shadow-sm backdrop-blur-sm border border-black/5">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">{item.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Uploaded on {item.date}</p>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2 line-clamp-2">{item.description}</p>
                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-600">
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">File: <span className='font-mono bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded'>{item.fileName}</span></p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 dark:text-slate-400 p-4">
            <UploadIcon className="w-16 h-16 mb-4" />
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white">No Contributions Yet</h2>
            <p className="max-w-xs mx-auto mt-1">Your uploaded media will appear here. Help preserve our heritage by contributing!</p>
            <button 
                onClick={onNavigateToUpload} 
                className="mt-6 py-3 px-6 bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold rounded-lg transition-colors"
            >
                Make a Contribution
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyContributionsScreen;