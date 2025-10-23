import React from 'react';
import { BrandInfo } from '../types';

interface BrandCardProps {
  brand: BrandInfo;
  onClick: () => void;
  isSelected: boolean;
}

export const BrandCard: React.FC<BrandCardProps> = ({ brand, onClick, isSelected }) => {
  const baseClasses = "bg-white dark:bg-slate-800 rounded-lg border p-4 flex flex-col items-center justify-start text-center transition-all duration-200 cursor-pointer h-full";
  const borderClasses = isSelected ? 'border-indigo-500 ring-2 ring-indigo-500' : 'border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500';

  return (
    <div onClick={onClick} className={`${baseClasses} ${borderClasses}`}>
        <h3 className="text-md font-semibold text-slate-800 dark:text-white">{brand.name}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 flex-grow">{brand.description}</p>
    </div>
  );
};