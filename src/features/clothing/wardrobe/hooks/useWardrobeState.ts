import { useState, useEffect } from 'react';
import { ClothingItem, ClothingFormData, ClothingCategory, Season } from '../types';

export const useWardrobeState = () => {
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<ClothingCategory | 'all'>('all');
  const [filterSeason, setFilterSeason] = useState<Season | 'all'>('all');

  useEffect(() => {
    const storedItems = localStorage.getItem('clothingItems');
    if (storedItems) {
      setItems(JSON.parse(storedItems));
    }
  }, []);

  const saveItems = (newItems: ClothingItem[]) => {
    setItems(newItems);
    localStorage.setItem('clothingItems', JSON.stringify(newItems));
  };

  const addItem = (formData: ClothingFormData) => {
    const newItem: ClothingItem = {
      id: Date.now().toString(),
      name: formData.name,
      category: formData.category,
      color: formData.color,
      brand: formData.brand || undefined,
      price: formData.price ? parseFloat(formData.price) : undefined,
      purchaseDate: formData.purchaseDate || undefined,
      imageUrl: formData.imageUrl || undefined,
      season: formData.season,
      notes: formData.notes || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveItems([...items, newItem]);
  };

  const updateItem = (id: string, formData: ClothingFormData) => {
    const updatedItems = items.map((item) =>
      item.id === id
        ? {
            ...item,
            name: formData.name,
            category: formData.category,
            color: formData.color,
            brand: formData.brand || undefined,
            price: formData.price ? parseFloat(formData.price) : undefined,
            purchaseDate: formData.purchaseDate || undefined,
            imageUrl: formData.imageUrl || undefined,
            season: formData.season,
            notes: formData.notes || undefined,
            updatedAt: new Date().toISOString(),
          }
        : item
    );
    saveItems(updatedItems);
  };

  const deleteItem = (id: string) => {
    const filteredItems = items.filter((item) => item.id !== id);
    saveItems(filteredItems);
  };

  const openModal = (item?: ClothingItem) => {
    setSelectedItem(item || null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setIsModalOpen(false);
  };

  const filteredItems = items.filter((item) => {
    const categoryMatch = filterCategory === 'all' || item.category === filterCategory;
    const seasonMatch = filterSeason === 'all' || item.season.includes(filterSeason);
    return categoryMatch && seasonMatch;
  });

  return {
    items: filteredItems,
    allItems: items,
    selectedItem,
    isModalOpen,
    filterCategory,
    filterSeason,
    setFilterCategory,
    setFilterSeason,
    addItem,
    updateItem,
    deleteItem,
    openModal,
    closeModal,
  };
};
