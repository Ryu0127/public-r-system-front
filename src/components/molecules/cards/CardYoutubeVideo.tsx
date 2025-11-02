import React from 'react';

export interface CardYoutubeVideoProps {
    object: any;
    addClass?: string;
    onSelectFavorite?: (video: Video) => void;
}

export interface Video {
    index: number;
    id: string;
    videoCode: string;
    videoTitle: string;
    videoUrl: string;
    videoTime: string;
    videoImgPath: string;
    favoriteFlag: boolean;
}

const CardYoutubeVideo: React.FC<CardYoutubeVideoProps> = ({ object, addClass="", onSelectFavorite=() => {} }) => {
    const handleFavoriteClick = (e: React.MouseEvent, video: Video) => {
        e.preventDefault();  // デフォルトアクションを防止
        e.stopPropagation(); // イベントを上位に伝播させない
        onSelectFavorite(video);
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative">
                <img style={{ objectFit:'cover', width:'330px', height:'180px' }} src={ object.videoImgPath } />
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-1 py-0.5 rounded">{ object.videoTime }</div>
            </div>
            <div className="p-2" style={{ width:'330px', height: '90px' }}>
                <div className='h-[45px]'>
                    <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-1" data-id="27">{ object.videoTitle }</h3>
                </div>
                <div className="flex justify-end mr-1">
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
        </div>
    );
};

export default CardYoutubeVideo;