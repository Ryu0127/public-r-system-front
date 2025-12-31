import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CoordinatePresenter } from '../presenters/CoordinatePresenter';
import { useCoordinateState } from '../hooks/useCoordinateState';

export const CoordinateContainer: React.FC = () => {
  const navigate = useNavigate();
  const {
    formData,
    selectedItems,
    setFormData,
    selectItem,
    getItemsByCategory,
    createCoordinate,
  } = useCoordinateState();

  const handleSave = () => {
    createCoordinate();
    navigate('/clothing/coordinate-list');
  };

  return (
    <CoordinatePresenter
      formData={formData}
      selectedItems={selectedItems}
      onFormChange={setFormData}
      onSelectItem={selectItem}
      getItemsByCategory={getItemsByCategory}
      onSave={handleSave}
    />
  );
};

export default CoordinateContainer;
