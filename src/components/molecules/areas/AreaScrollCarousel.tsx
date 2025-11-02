import React, { ReactNode } from 'react';

interface AreaScrollCarouselProps {
    children: ReactNode;
    addCss?: string;
    hidden: boolean;
}

/**
 * エリアコンポーネント（カルーセルスクロール）
 * @param children 子要素
 * @param addCss 追加CSS
 * @param hidden 非表示
 * @returns 
 */
const AreaScrollCarousel: React.FC<AreaScrollCarouselProps> = ({children, addCss, hidden}) => {
    return (
        <div 
          className={`js-scrollbar-channel flex overflow-x-auto space-x-4 pb-4 custom-scrollbar ${addCss}`}
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: hidden ? 'rgba(156, 163, 175, 0.5) transparent' : 'rgba(156, 163, 175, 0) transparent',
            transition: 'scrollbar-color 0.5s ease',
          }}
        >
          {children}
        </div>
    );
};

export default AreaScrollCarousel;