import React from 'react';
import { CoordinateListPresenter } from '../presenters/CoordinateListPresenter';
import { useCoordinateListState } from '../hooks/useCoordinateListState';

export const CoordinateListContainer: React.FC = () => {
  const {
    coordinates,
    selectedCoordinate,
    isDetailModalOpen,
    deleteCoordinate,
    openDetailModal,
    closeDetailModal,
  } = useCoordinateListState();

  return (
    <CoordinateListPresenter
      coordinates={coordinates}
      selectedCoordinate={selectedCoordinate}
      isDetailModalOpen={isDetailModalOpen}
      onCoordinateClick={openDetailModal}
      onDeleteClick={deleteCoordinate}
      onModalClose={closeDetailModal}
    />
  );
};

export default CoordinateListContainer;
