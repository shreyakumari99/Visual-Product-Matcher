import React from 'react';
import { ProductLinkCardSkeleton } from './ProductLinkCardSkeleton';

interface ProductLinkGridSkeletonProps {
    title: string;
}

export const ProductLinkGridSkeleton: React.FC<ProductLinkGridSkeletonProps> = ({ title }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, index) => (
          <ProductLinkCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
};
