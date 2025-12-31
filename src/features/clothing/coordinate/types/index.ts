import { ClothingItem } from '../../wardrobe/types';

export interface Coordinate {
  id: string;
  name: string;
  description?: string;
  items: {
    tops?: ClothingItem;
    bottoms?: ClothingItem;
    outerwear?: ClothingItem;
    shoes?: ClothingItem;
    accessories?: ClothingItem[];
  };
  occasion?: string;
  season?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CoordinateFormData {
  name: string;
  description: string;
  occasion: string;
  season: string;
  selectedItems: {
    tops?: string;
    bottoms?: string;
    outerwear?: string;
    shoes?: string;
    accessories?: string[];
  };
}
