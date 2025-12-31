import React from 'react';
import { CoordinateListHeader } from '../components/CoordinateListHeader';
import { CoordinateGrid } from '../components/CoordinateGrid';
import { CoordinateDetailModal } from '../components/CoordinateDetailModal';
import { Coordinate } from '../../coordinate/types';

interface CoordinateListPresenterProps {
  coordinates: Coordinate[];
  selectedCoordinate: Coordinate | null;
  isDetailModalOpen: boolean;
  onCoordinateClick: (coordinate: Coordinate) => void;
  onDeleteClick: (id: string) => void;
  onModalClose: () => void;
}

export const CoordinateListPresenter: React.FC<CoordinateListPresenterProps> = ({
  coordinates,
  selectedCoordinate,
  isDetailModalOpen,
  onCoordinateClick,
  onDeleteClick,
  onModalClose,
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <CoordinateListHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CoordinateGrid
          coordinates={coordinates}
          onCoordinateClick={onCoordinateClick}
          onDeleteClick={onDeleteClick}
        />
      </div>
      <CoordinateDetailModal
        isOpen={isDetailModalOpen}
        coordinate={selectedCoordinate}
        onClose={onModalClose}
      />
    </div>
  );
};
