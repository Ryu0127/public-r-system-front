import React from 'react';
import { Coordinate } from '../../coordinate/types';
import { CoordinateTorsoCard } from './CoordinateTorsoCard';

interface CoordinateGridProps {
  coordinates: Coordinate[];
  onCoordinateClick: (coordinate: Coordinate) => void;
  onDeleteClick: (id: string) => void;
}

export const CoordinateGrid: React.FC<CoordinateGridProps> = ({
  coordinates,
  onCoordinateClick,
  onDeleteClick,
}) => {
  if (coordinates.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="mx-auto w-32 h-32 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
          <svg
            className="h-16 w-16 text-indigo-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          コーディネートがありません
        </h3>
        <p className="text-gray-500 mb-6">
          お気に入りの服を組み合わせて、素敵なコーディネートを作りましょう
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {coordinates.map((coordinate) => (
        <CoordinateTorsoCard
          key={coordinate.id}
          coordinate={coordinate}
          onClick={() => onCoordinateClick(coordinate)}
          onDelete={() => onDeleteClick(coordinate.id)}
        />
      ))}
    </div>
  );
};
