import React from 'react';
import { NamedProductLink } from '../types';
import { ProductLinkCard } from './ProductLinkCard';

interface ProductLinkGridProps {
  title: string;
  links: NamedProductLink[];
}

export const ProductLinkGrid: React.FC<ProductLinkGridProps> = ({ title, links }) => {
  if (links.length === 0) return null;

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {links.map((link, index) => (
          <ProductLinkCard key={`${link.productUrl}-${index}`} link={link} />
        ))}
      </div>
    </div>
  );
};
