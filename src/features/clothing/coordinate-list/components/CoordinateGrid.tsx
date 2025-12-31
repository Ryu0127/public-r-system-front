import React from 'react';
import { Coordinate } from '../../coordinate/types';

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
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          コーディネートがありません
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          コーディネートを作成してみましょう
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {coordinates.map((coordinate) => (
        <div
          key={coordinate.id}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div
            onClick={() => onCoordinateClick(coordinate)}
            className="cursor-pointer"
          >
            <div className="aspect-w-3 aspect-h-4 bg-gray-100 p-4">
              <div className="space-y-2">
                {coordinate.items.outerwear && (
                  <div className="flex justify-center">
                    {coordinate.items.outerwear.imageUrl ? (
                      <img
                        src={coordinate.items.outerwear.imageUrl}
                        alt="アウター"
                        className="h-20 w-20 object-cover rounded"
                      />
                    ) : (
                      <div className="h-20 w-20 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                        アウター
                      </div>
                    )}
                  </div>
                )}
                {coordinate.items.tops && (
                  <div className="flex justify-center">
                    {coordinate.items.tops.imageUrl ? (
                      <img
                        src={coordinate.items.tops.imageUrl}
                        alt="トップス"
                        className="h-20 w-20 object-cover rounded"
                      />
                    ) : (
                      <div className="h-20 w-20 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                        トップス
                      </div>
                    )}
                  </div>
                )}
                {coordinate.items.bottoms && (
                  <div className="flex justify-center">
                    {coordinate.items.bottoms.imageUrl ? (
                      <img
                        src={coordinate.items.bottoms.imageUrl}
                        alt="ボトムス"
                        className="h-20 w-20 object-cover rounded"
                      />
                    ) : (
                      <div className="h-20 w-20 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                        ボトムス
                      </div>
                    )}
                  </div>
                )}
                {coordinate.items.shoes && (
                  <div className="flex justify-center">
                    {coordinate.items.shoes.imageUrl ? (
                      <img
                        src={coordinate.items.shoes.imageUrl}
                        alt="シューズ"
                        className="h-16 w-16 object-cover rounded"
                      />
                    ) : (
                      <div className="h-16 w-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                        シューズ
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {coordinate.name}
              </h3>
              {coordinate.description && (
                <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                  {coordinate.description}
                </p>
              )}
              <div className="mt-3 flex flex-wrap gap-2">
                {coordinate.occasion && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    {coordinate.occasion}
                  </span>
                )}
                {coordinate.season && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                    {coordinate.season === 'spring' && '春'}
                    {coordinate.season === 'summer' && '夏'}
                    {coordinate.season === 'autumn' && '秋'}
                    {coordinate.season === 'winter' && '冬'}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="px-4 pb-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteClick(coordinate.id);
              }}
              className="w-full px-3 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50"
            >
              削除
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
