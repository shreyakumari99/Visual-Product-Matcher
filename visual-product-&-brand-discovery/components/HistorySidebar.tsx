import React from 'react';
import { HistoryItem } from '../types';

interface HistorySidebarProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
  selectedHistoryItemId: string | null;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({ history, onSelect, onClear, selectedHistoryItemId }) => {
  return (
    <aside className="w-80 bg-slate-100 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-col h-screen sticky top-0 hidden lg:flex">
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Recent Searches</h2>
      </div>
      <div className="flex-grow overflow-y-auto">
        {history.length === 0 ? (
          <div className="p-6 text-center text-sm text-slate-500 dark:text-slate-400">
            Your recent searches will appear here.
          </div>
        ) : (
          <ul>
            {history.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => onSelect(item)}
                  className={`w-full text-left p-3 flex items-center space-x-3 transition-colors ${
                    selectedHistoryItemId === item.id
                      ? 'bg-indigo-100 dark:bg-indigo-900/50'
                      : 'hover:bg-slate-200 dark:hover:bg-slate-800'
                  }`}
                  aria-current={selectedHistoryItemId === item.id}
                >
                  <img
                    src={`data:${item.userImage.mimeType};base64,${item.userImage.data}`}
                    alt="Uploaded product"
                    className="w-12 h-12 rounded-md object-cover bg-slate-300 dark:bg-slate-700"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 dark:text-white truncate capitalize">
                      {item.identifiedProduct}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {history.length > 0 && (
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={onClear}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-slate-100 dark:focus:ring-offset-slate-900"
          >
            Clear History
          </button>
        </div>
      )}
    </aside>
  );
};
