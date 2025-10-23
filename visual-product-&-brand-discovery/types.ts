export interface BrandInfo {
  name: string;
  description: string;
}

export interface NamedProductLink {
  name: string;
  productUrl: string;
  imageUrl?: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  userImage: { mimeType: string; data: string };
  identifiedProduct: string;
  directLinks: NamedProductLink[];
  brands: BrandInfo[];
}
