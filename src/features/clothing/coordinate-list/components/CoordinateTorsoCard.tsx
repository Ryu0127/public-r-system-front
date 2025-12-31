import React from 'react';
import { Coordinate } from '../../coordinate/types';

interface CoordinateTorsoCardProps {
  coordinate: Coordinate;
  onClick: () => void;
  onDelete: () => void;
}

export const CoordinateTorsoCard: React.FC<CoordinateTorsoCardProps> = ({
  coordinate,
  onClick,
  onDelete,
}) => {
  return (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:scale-105">
      <div onClick={onClick} className="cursor-pointer">
        {/* カード上部：コーディネート名とタグ */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4">
          <h3 className="text-lg font-bold text-white truncate">
            {coordinate.name}
          </h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {coordinate.occasion && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/20 text-white backdrop-blur-sm">
                {coordinate.occasion}
              </span>
            )}
            {coordinate.season && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/20 text-white backdrop-blur-sm">
                {coordinate.season === 'spring' && '🌸 春'}
                {coordinate.season === 'summer' && '☀️ 夏'}
                {coordinate.season === 'autumn' && '🍂 秋'}
                {coordinate.season === 'winter' && '❄️ 冬'}
              </span>
            )}
          </div>
        </div>

        {/* トルソー表示エリア */}
        <div className="relative bg-gradient-to-b from-gray-50 to-gray-100 p-6">
          {/* 背景のトルソーシルエット */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5">
            <svg viewBox="0 0 200 400" className="w-32 h-64">
              <ellipse cx="100" cy="60" rx="40" ry="30" fill="currentColor" />
              <rect x="70" y="80" width="60" height="120" rx="10" fill="currentColor" />
              <path d="M 70 120 Q 40 140 40 180 L 40 250" stroke="currentColor" strokeWidth="20" fill="none" />
              <path d="M 130 120 Q 160 140 160 180 L 160 250" stroke="currentColor" strokeWidth="20" fill="none" />
              <rect x="80" y="200" width="20" height="180" rx="10" fill="currentColor" />
              <rect x="100" y="200" width="20" height="180" rx="10" fill="currentColor" />
            </svg>
          </div>

          {/* アイテムの重ねて表示 */}
          <div className="relative space-y-2" style={{ minHeight: '280px' }}>
            {/* アウター */}
            {coordinate.items.outerwear && (
              <div className="flex justify-center">
                <div className="w-32 h-24 bg-white rounded-lg shadow-md p-1 border-2 border-indigo-200">
                  {coordinate.items.outerwear.imageUrl ? (
                    <img
                      src={coordinate.items.outerwear.imageUrl}
                      alt="アウター"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-indigo-200 rounded flex items-center justify-center">
                      <span className="text-xs text-indigo-700 font-medium">
                        {coordinate.items.outerwear.name}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* トップス */}
            {coordinate.items.tops && (
              <div className="flex justify-center">
                <div className="w-32 h-20 bg-white rounded-lg shadow-md p-1 border-2 border-blue-200">
                  {coordinate.items.tops.imageUrl ? (
                    <img
                      src={coordinate.items.tops.imageUrl}
                      alt="トップス"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 rounded flex items-center justify-center">
                      <span className="text-xs text-blue-700 font-medium">
                        {coordinate.items.tops.name}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ボトムス */}
            {coordinate.items.bottoms && (
              <div className="flex justify-center">
                <div className="w-32 h-20 bg-white rounded-lg shadow-md p-1 border-2 border-green-200">
                  {coordinate.items.bottoms.imageUrl ? (
                    <img
                      src={coordinate.items.bottoms.imageUrl}
                      alt="ボトムス"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-green-100 to-green-200 rounded flex items-center justify-center">
                      <span className="text-xs text-green-700 font-medium">
                        {coordinate.items.bottoms.name}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* シューズ */}
            {coordinate.items.shoes && (
              <div className="flex justify-center">
                <div className="w-28 h-16 bg-white rounded-lg shadow-md p-1 border-2 border-purple-200">
                  {coordinate.items.shoes.imageUrl ? (
                    <img
                      src={coordinate.items.shoes.imageUrl}
                      alt="シューズ"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-100 to-purple-200 rounded flex items-center justify-center">
                      <span className="text-xs text-purple-700 font-medium">
                        {coordinate.items.shoes.name}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 小物（下部に小さく表示） */}
            {coordinate.items.accessories && coordinate.items.accessories.length > 0 && (
              <div className="flex justify-center gap-1 pt-2">
                {coordinate.items.accessories.slice(0, 3).map((accessory, index) => (
                  <div key={index} className="w-12 h-12 bg-white rounded-md shadow-sm p-0.5 border border-yellow-200">
                    {accessory.imageUrl ? (
                      <img
                        src={accessory.imageUrl}
                        alt={accessory.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-yellow-100 to-yellow-200 rounded flex items-center justify-center">
                        <span className="text-[8px] text-yellow-700">
                          {accessory.name.slice(0, 4)}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
                {coordinate.items.accessories.length > 3 && (
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-md shadow-sm flex items-center justify-center border border-yellow-200">
                    <span className="text-xs font-bold text-yellow-700">
                      +{coordinate.items.accessories.length - 3}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 説明文 */}
        {coordinate.description && (
          <div className="px-4 py-3 bg-gray-50">
            <p className="text-sm text-gray-600 line-clamp-2">
              {coordinate.description}
            </p>
          </div>
        )}
      </div>

      {/* 削除ボタン */}
      <div className="px-4 pb-4 bg-white">
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (window.confirm('このコーディネートを削除しますか？')) {
              onDelete();
            }
          }}
          className="w-full px-3 py-2 border-2 border-red-200 rounded-lg text-sm font-medium text-red-600 bg-white hover:bg-red-50 hover:border-red-300 transition-all"
        >
          削除
        </button>
      </div>
    </div>
  );
};
