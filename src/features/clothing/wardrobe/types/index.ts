export type ClothingCategory =
  | 'tops'
  | 'bottoms'
  | 'outerwear'
  | 'shoes'
  | 'accessories';

export type ClothingColor =
  | 'black'
  | 'white'
  | 'gray'
  | 'navy'
  | 'blue'
  | 'brown'
  | 'beige'
  | 'green'
  | 'red'
  | 'other';

export type Season = 'spring' | 'summer' | 'autumn' | 'winter' | 'all';

export interface ClothingItem {
  id: string;
  name: string;
  category: ClothingCategory;
  color: ClothingColor;
  brand?: string;
  price?: number;
  purchaseDate?: string;
  imageUrl?: string;
  season: Season[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClothingFormData {
  name: string;
  category: ClothingCategory;
  color: ClothingColor;
  brand: string;
  price: string;
  purchaseDate: string;
  imageUrl: string;
  season: Season[];
  notes: string;
}
