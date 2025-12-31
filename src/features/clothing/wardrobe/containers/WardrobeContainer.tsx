import React from 'react';
import { WardrobePresenter } from '../presenters/WardrobePresenter';
import { useWardrobeState } from '../hooks/useWardrobeState';

export const WardrobeContainer: React.FC = () => {
  const {
    items,
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
  } = useWardrobeState();

  const handleSave = (formData: any) => {
    if (selectedItem) {
      updateItem(selectedItem.id, formData);
    } else {
      addItem(formData);
    }
  };

  return (
    <WardrobePresenter
      items={items}
      selectedItem={selectedItem}
      isModalOpen={isModalOpen}
      filterCategory={filterCategory}
      filterSeason={filterSeason}
      onCategoryChange={setFilterCategory}
      onSeasonChange={setFilterSeason}
      onAddClick={() => openModal()}
      onItemClick={openModal}
      onDeleteClick={deleteItem}
      onModalClose={closeModal}
      onSave={handleSave}
    />
  );
};

export default WardrobeContainer;
