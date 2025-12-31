import { useState, useEffect } from 'react';
import { Coordinate, CoordinateFormData } from '../types';
import { ClothingItem } from '../../wardrobe/types';

export const useCoordinateState = () => {
  const [coordinates, setCoordinates] = useState<Coordinate[]>([]);
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<{
    tops?: string;
    bottoms?: string;
    outerwear?: string;
    shoes?: string;
    accessories: string[];
  }>({
    accessories: [],
  });
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    occasion: '',
    season: '',
  });

  useEffect(() => {
    const storedCoordinates = localStorage.getItem('coordinates');
    if (storedCoordinates) {
      setCoordinates(JSON.parse(storedCoordinates));
    }

    const storedItems = localStorage.getItem('clothingItems');
    if (storedItems) {
      setClothingItems(JSON.parse(storedItems));
    }
  }, []);

  const saveCoordinates = (newCoordinates: Coordinate[]) => {
    setCoordinates(newCoordinates);
    localStorage.setItem('coordinates', JSON.stringify(newCoordinates));
  };

  const getItemById = (id: string): ClothingItem | undefined => {
    return clothingItems.find((item) => item.id === id);
  };

  const createCoordinate = () => {
    if (!formData.name) {
      alert('コーディネート名を入力してください');
      return;
    }

    const newCoordinate: Coordinate = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description || undefined,
      occasion: formData.occasion || undefined,
      season: formData.season || undefined,
      items: {
        tops: selectedItems.tops ? getItemById(selectedItems.tops) : undefined,
        bottoms: selectedItems.bottoms ? getItemById(selectedItems.bottoms) : undefined,
        outerwear: selectedItems.outerwear ? getItemById(selectedItems.outerwear) : undefined,
        shoes: selectedItems.shoes ? getItemById(selectedItems.shoes) : undefined,
        accessories: selectedItems.accessories
          .map((id) => getItemById(id))
          .filter((item): item is ClothingItem => item !== undefined),
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveCoordinates([...coordinates, newCoordinate]);

    // Reset form
    setSelectedItems({ accessories: [] });
    setFormData({
      name: '',
      description: '',
      occasion: '',
      season: '',
    });
  };

  const selectItem = (category: string, itemId: string) => {
    if (category === 'accessories') {
      setSelectedItems((prev) => ({
        ...prev,
        accessories: prev.accessories.includes(itemId)
          ? prev.accessories.filter((id) => id !== itemId)
          : [...prev.accessories, itemId],
      }));
    } else {
      setSelectedItems((prev) => ({
        ...prev,
        [category]: prev[category as keyof typeof prev] === itemId ? undefined : itemId,
      }));
    }
  };

  const getItemsByCategory = (category: string) => {
    return clothingItems.filter((item) => item.category === category);
  };

  return {
    coordinates,
    clothingItems,
    selectedItems,
    formData,
    setFormData,
    selectItem,
    getItemsByCategory,
    createCoordinate,
  };
};
