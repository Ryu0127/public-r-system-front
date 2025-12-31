import { useState, useEffect } from 'react';
import { Coordinate } from '../../coordinate/types';

export const useCoordinateListState = () => {
  const [coordinates, setCoordinates] = useState<Coordinate[]>([]);
  const [selectedCoordinate, setSelectedCoordinate] = useState<Coordinate | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    const storedCoordinates = localStorage.getItem('coordinates');
    if (storedCoordinates) {
      setCoordinates(JSON.parse(storedCoordinates));
    }
  }, []);

  const saveCoordinates = (newCoordinates: Coordinate[]) => {
    setCoordinates(newCoordinates);
    localStorage.setItem('coordinates', JSON.stringify(newCoordinates));
  };

  const deleteCoordinate = (id: string) => {
    const filteredCoordinates = coordinates.filter((coord) => coord.id !== id);
    saveCoordinates(filteredCoordinates);
  };

  const openDetailModal = (coordinate: Coordinate) => {
    setSelectedCoordinate(coordinate);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setSelectedCoordinate(null);
    setIsDetailModalOpen(false);
  };

  return {
    coordinates,
    selectedCoordinate,
    isDetailModalOpen,
    deleteCoordinate,
    openDetailModal,
    closeDetailModal,
  };
};
