import { useEffect } from 'react';

const useTitle = (pageTitle) => {
    useEffect(() => {
        // ページタイトルの設定
        document.title = pageTitle;
    }, []);
};

export default useTitle;