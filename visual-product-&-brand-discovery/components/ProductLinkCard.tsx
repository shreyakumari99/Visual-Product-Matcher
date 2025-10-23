import React, { useState, useEffect } from 'react';
import { NamedProductLink } from '../types';

interface ProductLinkCardProps {
  link: NamedProductLink;
}

// A generic, attractive placeholder image SVG, encoded as a data URI.
// This SVG displays a subtle gradient and a stylized image icon.
const placeholderImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJnIiB4MT0iMCIgeTE9IjAiIHgyPSIxIiB5Mj0iMSI+PHN0b3Agc3RvcC1jb2xvcj0iI0UyRThGMCIgb2Zmc2V0PSIwJSIvPjxzdG9wIHN0b3AtY29sb3I9IiNDQkQ1RTEiIG9mZnNldD0iMTAwJSIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSJ1cmwoI2cpIi8+PHBhdGggZD0iTTIwIDgwIGwyMC0yMCBsMTAgMTAgbDIwLTMwIGwyMC AyMCIgc3Ryb2tlPSIjOTRBM0I4IiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjxjaXJjbGUgY3g9IjM1IiBjeT0iMzUiIHI9IjUiIGZpbGw9IiM5NEEzQjgiLz48L3N2Zz4=';


export const ProductLinkCard: React.FC<ProductLinkCardProps> = ({ link }) => {
  const [imageError, setImageError] = useState(false);

  // Reset the error state when the link prop (specifically the imageUrl) changes.
  // This prevents a previous error state from persisting if the component is reused for a new item.
  useEffect(() => {
    setImageError(false);
  }, [link.imageUrl]);

  const handleImageError = () => {
    setImageError(true);
  };
  
  let domain = 'Unknown';
  try {
    if (link.productUrl) {
      domain = new URL(link.productUrl).hostname.replace('www.', '');
    }
  } catch (e) {
    console.warn("Invalid URL in ProductLinkCard:", link.productUrl);
  }

  const showPlaceholder = !link.imageUrl || imageError;

  return (
    <a
      href={link.productUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-lg transition-all"
    >
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0 w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-md flex items-center justify-center overflow-hidden">
          {showPlaceholder ? (
            <img 
              src={placeholderImage} 
              alt="Placeholder" 
              className="w-full h-full object-cover" 
            />
          ) : (
            <img 
              src={link.imageUrl} 
              alt={link.name} 
              className="w-full h-full object-cover" 
              onError={handleImageError}
            />
          )}
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-800 dark:text-white truncate" title={link.name}>
              {link.name}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate" title={domain}>
              {domain}
            </p>
            <div className="mt-3">
              <span className="inline-flex items-center text-xs font-medium text-indigo-600 dark:text-indigo-400">
                View Product
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </span>
            </div>
        </div>
      </div>
    </a>
  );
};