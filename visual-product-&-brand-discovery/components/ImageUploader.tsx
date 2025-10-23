import React, { useState } from 'react';

interface ImageUploaderProps {
  onImageSubmit: (image: { mimeType: string, data: string }) => void;
  isLoading: boolean;
}

const fileToBase64 = (file: File): Promise<{ mimeType: string, data: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const mimeType = result.split(';')[0].split(':')[1];
      const data = result.split(',')[1];
      resolve({ mimeType, data });
    };
    reader.onerror = error => reject(error);
  });
};

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSubmit, isLoading }) => {
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = async (file: File) => {
    if (file.size > 4 * 1024 * 1024) { // 4MB limit
      setError('File is too large. Please select an image under 4MB.');
      return;
    }
    try {
      setError(null);
      const image = await fileToBase64(file);
      onImageSubmit(image);
    } catch (err) {
      setError('Could not process the file. Please try again.');
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto p-8 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
      <h2 className="text-3xl font-bold text-center text-slate-800 dark:text-white mb-6">Discover Brands by Image</h2>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4" role="alert">{error}</div>}
      
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors h-full flex flex-col justify-center ${isDragging ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-slate-300 dark:border-slate-600 hover:border-indigo-500 dark:hover:border-indigo-400'}`}
      >
        <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <label htmlFor="file-upload" className="relative cursor-pointer mt-4 font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">
          <span>Upload an image</span>
          <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/png, image/jpeg, image/webp" />
        </label>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">or drag and drop</p>
        <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">PNG, JPG, WEBP up to 4MB</p>
      </div>
    </div>
  );
};