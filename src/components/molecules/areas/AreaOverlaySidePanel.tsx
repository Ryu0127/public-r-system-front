import React, { ReactNode, useState, useEffect } from 'react';

interface AreaOverlaySidePanelProps {
    children: ReactNode;
    isOpen: boolean;
    width: string;
    addCss?: string;
}

/**
 * エリアコンポーネント（オーバーレイサイドスライド）
 * @param children 子要素
 * @param isOpen 表示
 * @param width 幅
 * @param addCss 追加CSS
 * @returns 
 */
const AreaOverlaySidePanel: React.FC<AreaOverlaySidePanelProps> = ({children, isOpen, width, addCss}) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        // 初回チェック
        checkMobile();
        
        // リサイズ時に再チェック
        window.addEventListener('resize', checkMobile);
        
        return () => {
            window.removeEventListener('resize', checkMobile);
        };
    }, []);

    return (
        <div
            className={`fixed inset-y-0 right-0 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? "translate-x-0" : "translate-x-full"} ${isMobile ? 'w-full' : ''}`}
            style={isMobile ? { width: '100%' } : {}}
        >
            <div className={`h-full overflow-y-auto w-full ${addCss}`} style={{ 
                width: isMobile ? '100%' : width
            }}>
                {children}
            </div>
        </div>
    );
};

export default AreaOverlaySidePanel;