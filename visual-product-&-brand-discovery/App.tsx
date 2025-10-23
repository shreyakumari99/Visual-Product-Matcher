
import React, { useState, useCallback, useEffect } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { Loader } from './components/Loader';
import { ErrorMessage } from './components/ErrorMessage';
import { BrandGrid } from './components/BrandGrid';
import { ProductLinkGrid } from './components/ProductLinkGrid';
import { initialImageAnalysis, findProductsForBrand } from './services/geminiService';
import { BrandInfo, NamedProductLink, HistoryItem } from './types';
import { getHistory, addHistoryItem, clearHistory } from './services/historyService';
import { HistorySidebar } from './components/HistorySidebar';
import { ProductLinkGridSkeleton } from './components/ProductLinkGridSkeleton';


function App() {
  // Overall state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Data state
  const [userImage, setUserImage] = useState<{ mimeType: string, data: string } | null>(null);
  const [identifiedProduct, setIdentifiedProduct] = useState<string>('');
  const [directLinks, setDirectLinks] = useState<NamedProductLink[]>([]);
  const [brands, setBrands] = useState<BrandInfo[]>([]);
  
  // Brand interaction state
  const [selectedBrand, setSelectedBrand] = useState<BrandInfo | null>(null);
  const [isLoadingBrandLinks, setIsLoadingBrandLinks] = useState(false);
  const [brandProductLinks, setBrandProductLinks] = useState<NamedProductLink[]>([]);

  // History state
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedHistoryItemId, setSelectedHistoryItemId] = useState<string | null>(null);
  
  // UI/Animation state
  const [resultsVisible, setResultsVisible] = useState(false);

  useEffect(() => {
    setHistory(getHistory());
  }, []);
  
  const hasResults = directLinks.length > 0 || brands.length > 0;

  useEffect(() => {
    if (hasResults && !isLoading) {
        const timer = setTimeout(() => setResultsVisible(true), 50);
        return () => clearTimeout(timer);
    }
  }, [hasResults, isLoading]);


  const resetForNewSearch = () => {
    setIsLoading(false);
    setError(null);
    setUserImage(null);
    setIdentifiedProduct('');
    setDirectLinks([]);
    setBrands([]);
    setSelectedBrand(null);
    setIsLoadingBrandLinks(false);
    setBrandProductLinks([]);
    setSelectedHistoryItemId(null);
    setResultsVisible(false);
  };

  const handleImageSubmit = async (image: { mimeType: string, data: string }) => {
    resetForNewSearch();
    setIsLoading(true);
    setUserImage(image);

    try {
      const results = await initialImageAnalysis(image);
      const productName = results.identifiedProduct || 'your product';
      const productLinks = results.directLinks || [];
      const brandInfo = results.brands || [];

      setIdentifiedProduct(productName);
      setDirectLinks(productLinks);
      setBrands(brandInfo);

      const newHistoryItem: HistoryItem = {
        id: `search-${Date.now()}`,
        timestamp: Date.now(),
        userImage: image,
        identifiedProduct: productName,
        directLinks: productLinks,
        brands: brandInfo,
      };
      const updatedHistory = addHistoryItem(newHistoryItem);
      setHistory(updatedHistory);
      setSelectedHistoryItemId(newHistoryItem.id);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleHistorySelect = (item: HistoryItem) => {
    setIsLoadingBrandLinks(false);
    setBrandProductLinks([]);
    setSelectedBrand(null);
    setError(null);
    setIsLoading(false);

    setUserImage(item.userImage);
    setIdentifiedProduct(item.identifiedProduct);
    setDirectLinks(item.directLinks);
    setBrands(item.brands);
    setSelectedHistoryItemId(item.id);
    setResultsVisible(true);
  };
  
  const handleClearHistory = () => {
    clearHistory();
    setHistory([]);
    resetForNewSearch();
  };

  const handleBrandClick = useCallback(async (brand: BrandInfo) => {
    if (!userImage) return;
    if (selectedBrand?.name === brand.name && isLoadingBrandLinks) return;

    setSelectedBrand(brand);
    setIsLoadingBrandLinks(true);
    setBrandProductLinks([]);
    setError(null);

    try {
      const results = await findProductsForBrand(userImage, identifiedProduct, brand.name);
      setBrandProductLinks(results || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred while fetching brand products.');
    } finally {
      setIsLoadingBrandLinks(false);
    }
  }, [userImage, identifiedProduct, selectedBrand, isLoadingBrandLinks]);

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen flex">
      <HistorySidebar
        history={history}
        onSelect={handleHistorySelect}
        onClear={handleClearHistory}
        selectedHistoryItemId={selectedHistoryItemId}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
          <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Visual Product Discovery</h1>
            {(userImage || error) && !isLoading && (
              <button
                onClick={resetForNewSearch}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Start New Search
              </button>
            )}
          </div>
        </header>
        <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow">
          {!userImage && !isLoading && !error && (
            <div className="h-full flex items-center justify-center">
              <ImageUploader onImageSubmit={handleImageSubmit} isLoading={isLoading} />
            </div>
          )}

          {isLoading && <Loader message="Analyzing your image..." subMessage="Identifying products and discovering brands." />}
          
          {error && !isLoading && (
              <div className="max-w-xl mx-auto text-center">
                  <ErrorMessage message={error} />
              </div>
          )}

          {userImage && hasResults && !isLoading && (
            <div className={`space-y-16 transition-opacity duration-700 ease-in-out ${resultsVisible ? 'opacity-100' : 'opacity-0'}`}>
              <div className="text-center">
                <p className="text-md text-slate-600 dark:text-slate-400">We identified your item as a:</p>
                <h2 className="text-4xl font-bold text-slate-800 dark:text-white mt-1 capitalize">{identifiedProduct}</h2>
              </div>
              
              <ProductLinkGrid title="Direct Product Links" links={directLinks} />

              {brands.length > 0 && (
                <div>
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Discover Popular Brands</h2>
                    <p className="mt-2 text-slate-600 dark:text-slate-400">Click a brand below to explore specific product examples.</p>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    <div className="lg:col-span-1 lg:sticky top-24">
                        <BrandGrid
                            brands={brands}
                            onBrandClick={handleBrandClick}
                            selectedBrandName={selectedBrand?.name || null}
                        />
                    </div>
                    <div className="lg:col-span-2 bg-slate-100 dark:bg-slate-900 p-6 rounded-lg min-h-[400px] flex flex-col">
                        {!selectedBrand ? (
                          <div className="flex-grow flex flex-col justify-center items-center text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3.5m0 0V11" />
                            </svg>
                            <h3 className="mt-4 text-lg font-medium text-slate-800 dark:text-white">Select a Brand</h3>
                            <p className="mt-1 text-slate-500 dark:text-slate-400">Choose a brand from the list to see product examples.</p>
                          </div>
                        ) : isLoadingBrandLinks ? (
                           <ProductLinkGridSkeleton title={`Searching for ${selectedBrand.name} products...`} />
                        ) : brandProductLinks.length > 0 ? (
                            <ProductLinkGrid
                                title={`Products from ${selectedBrand.name}`}
                                links={brandProductLinks}
                            />
                        ) : (
                          <div className="flex-grow flex flex-col justify-center items-center text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 10.5a.5.5 0 01.5-.5h3a.5.5 0 010 1h-3a.5.5 0 01-.5-.5z" />
                            </svg>
                            <h3 className="mt-4 text-lg font-medium text-slate-800 dark:text-white">No Specific Products Found</h3>
                            <p className="mt-1 text-slate-500 dark:text-slate-400">We couldn't find product links for "{selectedBrand.name}" at this time.</p>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
