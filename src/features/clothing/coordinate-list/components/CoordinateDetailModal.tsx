import React from 'react';
import { Coordinate } from '../../coordinate/types';

interface CoordinateDetailModalProps {
  isOpen: boolean;
  coordinate: Coordinate | null;
  onClose: () => void;
}

export const CoordinateDetailModal: React.FC<CoordinateDetailModalProps> = ({
  isOpen,
  coordinate,
  onClose,
}) => {
  if (!isOpen || !coordinate) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {coordinate.name}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {coordinate.description && (
            <p className="text-gray-600 mb-6">{coordinate.description}</p>
          )}

          <div className="flex flex-wrap gap-2 mb-6">
            {coordinate.occasion && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {coordinate.occasion}
              </span>
            )}
            {coordinate.season && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                {coordinate.season === 'spring' && '春'}
                {coordinate.season === 'summer' && '夏'}
                {coordinate.season === 'autumn' && '秋'}
                {coordinate.season === 'winter' && '冬'}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {coordinate.items.outerwear && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  アウター
                </h3>
                {coordinate.items.outerwear.imageUrl ? (
                  <img
                    src={coordinate.items.outerwear.imageUrl}
                    alt={coordinate.items.outerwear.name}
                    className="w-full h-48 object-cover rounded mb-2"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 rounded mb-2 flex items-center justify-center">
                    <span className="text-gray-400">画像なし</span>
                  </div>
                )}
                <p className="text-sm font-medium text-gray-900">
                  {coordinate.items.outerwear.name}
                </p>
                {coordinate.items.outerwear.brand && (
                  <p className="text-xs text-gray-500">
                    {coordinate.items.outerwear.brand}
                  </p>
                )}
              </div>
            )}

            {coordinate.items.tops && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  トップス
                </h3>
                {coordinate.items.tops.imageUrl ? (
                  <img
                    src={coordinate.items.tops.imageUrl}
                    alt={coordinate.items.tops.name}
                    className="w-full h-48 object-cover rounded mb-2"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 rounded mb-2 flex items-center justify-center">
                    <span className="text-gray-400">画像なし</span>
                  </div>
                )}
                <p className="text-sm font-medium text-gray-900">
                  {coordinate.items.tops.name}
                </p>
                {coordinate.items.tops.brand && (
                  <p className="text-xs text-gray-500">
                    {coordinate.items.tops.brand}
                  </p>
                )}
              </div>
            )}

            {coordinate.items.bottoms && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  ボトムス
                </h3>
                {coordinate.items.bottoms.imageUrl ? (
                  <img
                    src={coordinate.items.bottoms.imageUrl}
                    alt={coordinate.items.bottoms.name}
                    className="w-full h-48 object-cover rounded mb-2"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 rounded mb-2 flex items-center justify-center">
                    <span className="text-gray-400">画像なし</span>
                  </div>
                )}
                <p className="text-sm font-medium text-gray-900">
                  {coordinate.items.bottoms.name}
                </p>
                {coordinate.items.bottoms.brand && (
                  <p className="text-xs text-gray-500">
                    {coordinate.items.bottoms.brand}
                  </p>
                )}
              </div>
            )}

            {coordinate.items.shoes && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  シューズ
                </h3>
                {coordinate.items.shoes.imageUrl ? (
                  <img
                    src={coordinate.items.shoes.imageUrl}
                    alt={coordinate.items.shoes.name}
                    className="w-full h-48 object-cover rounded mb-2"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 rounded mb-2 flex items-center justify-center">
                    <span className="text-gray-400">画像なし</span>
                  </div>
                )}
                <p className="text-sm font-medium text-gray-900">
                  {coordinate.items.shoes.name}
                </p>
                {coordinate.items.shoes.brand && (
                  <p className="text-xs text-gray-500">
                    {coordinate.items.shoes.brand}
                  </p>
                )}
              </div>
            )}

            {coordinate.items.accessories &&
              coordinate.items.accessories.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4 md:col-span-2">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    小物
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {coordinate.items.accessories.map((accessory, index) => (
                      <div key={index}>
                        {accessory.imageUrl ? (
                          <img
                            src={accessory.imageUrl}
                            alt={accessory.name}
                            className="w-full h-24 object-cover rounded mb-1"
                          />
                        ) : (
                          <div className="w-full h-24 bg-gray-200 rounded mb-1 flex items-center justify-center">
                            <span className="text-xs text-gray-400">
                              画像なし
                            </span>
                          </div>
                        )}
                        <p className="text-xs font-medium text-gray-900 truncate">
                          {accessory.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              閉じる
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
