import React from 'react';
import { BrandInfo } from '../types';
import { BrandCard } from './BrandCard';

interface BrandGridProps {
  brands: BrandInfo[];
  onBrandClick: (brand: BrandInfo) => void;
  selectedBrandName: string | null;
}

export const BrandGrid: React.FC<BrandGridProps> = ({ brands, onBrandClick, selectedBrandName }) => {
  if (brands.length === 0) return null;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
      {brands.map((brand) => (
        <BrandCard
          key={brand.name}
          brand={brand}
          onClick={() => onBrandClick(brand)}
          isSelected={selectedBrandName === brand.name}
        />
      ))}
    </div>
  );
};