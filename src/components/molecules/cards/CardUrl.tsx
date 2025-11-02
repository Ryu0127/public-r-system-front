import React from 'react';
import IconOpenInNew from 'components/atoms/icons/IconOpenInNew';

interface Props {
    object: CardUrl;
    addClass?: string;
    width?: string;
    height?: string;
    descriptionHeight?: string;
    onSelectFavorite?: (video: CardUrl) => void;
}

export interface CardUrl {
    index: number;
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    externalLinks: string;
    favoriteFlag: boolean;
}

const CardUrl: React.FC<Props> = ({
    object,
    addClass = "",
    width = "100%",
    height = "100%",
    descriptionHeight = "100%",
    onSelectFavorite = () => {}
}) => {
    const handleFavoriteClick = (e: React.MouseEvent, video: CardUrl) => {
        e.preventDefault();  // デフォルトアクションを防止
        e.stopPropagation(); // イベントを上位に伝播させない
        onSelectFavorite(video);
    };

    return (
        <div className={`max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden ${addClass}`} style={{ width: width, height: height }}>
            {/* メイン画像とコンテンツ */}
            <div className="relative">
                <img src={object.imageUrl} />
            </div>

            {/* 説明 */}
            <div className="px-4 py-3 border-b border-gray-200" style={{ height: descriptionHeight }}>
                <h2 className="mt-2 text-base font-semibold text-blue-600 hover:text-blue-800 cursor-pointer">
                    {object.title}
                </h2>
                <p className="text-sm text-gray-600 mt-1 mb-1">
                    {object.description}
                </p>
            </div>


            {/* フッター */}
            <div className="flex justify-end mr-1">
                <a href={object.externalLinks} target="_blank" rel="noopener noreferrer">
                    <IconOpenInNew />
                </a>
                <label className='cursor-pointer'>
                    <input type="checkbox" className="d-none favorite-input" defaultChecked={ object.favoriteFlag } />
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="32" 
                        height="32" 
                        viewBox="0 0 100 100"
                        onClick={(e) => handleFavoriteClick(e, object)}
                        className="cursor-pointer"
                    >
                        <path 
                            className="favorite-icon" 
                            d="M 50 80 C 50 80, 90 55, 90 30 Q 90 10, 70 10 Q 50 10, 50 30 Q 50 10, 30 10 Q 10 10, 10 30 C 10 55, 50 80, 50 80 Z" 
                            fill={object.favoriteFlag ? "#ff6b6b" : "#d1d1d1"}
                            stroke="none"
                        />
                    </svg>
                </label>
            </div>
        </div>
    );
};

export default CardUrl;