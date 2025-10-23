import React from 'react';

export const ProductLinkCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
      <div className="flex items-center space-x-4 animate-pulse">
        <div className="flex-shrink-0 w-20 h-20 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
        <div className="flex-1 min-w-0 space-y-3">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mt-2"></div>
        </div>
      </div>
    </div>
  );
};
