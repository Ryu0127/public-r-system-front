import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getCookie, setCookie } from 'utils/cookieUtil';
import { useAutoLoginPostApi } from 'hooks/api/auth/useAutoLoginPostApi';

/**
 * 認証チェック用カスタムフック
 *
 * - 自動ログイントークンをチェック
 * - 存在する場合は自動ログイン認証APIを実行
 * - 存在しない場合はログイン画面にリダイレクト
 * - 認証成功時は認証トークンをlocalStorageに保存
 */
export const useAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { executeAutoLogin } = useAutoLoginPostApi();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // 既に認証トークンがある場合は、自動ログイン処理をスキップ
      const existingToken = localStorage.getItem('token');
      if (existingToken) {
        setIsAuthenticated(true);
        setIsChecking(false);
        return;
      }

      // 自動ログイントークンを取得
      const autoLoginToken = getCookie('autoLoginToken');

      if (!autoLoginToken) {
        // 自動ログイントークンが存在しない場合はログイン画面にリダイレクト
        navigate('/login', {
          state: { from: location.pathname + location.search }
        });
        setIsChecking(false);
        return;
      }

      // 自動ログイン認証APIを実行
      const { apiResponse, error } = await executeAutoLogin({ autoLoginToken });

      if (error || !apiResponse || !apiResponse.status || !apiResponse.data) {
        // 認証失敗時はログイン画面にリダイレクト
        navigate('/login', {
          state: { from: location.pathname + location.search }
        });
        setIsChecking(false);
        return;
      }

      // 認証成功時の処理
      // 認証トークンをlocalStorageに保存
      localStorage.setItem('token', apiResponse.data.token);

      // 新しい自動ログイントークンをクッキーに保存
      setCookie('autoLoginToken', apiResponse.data.autoLoginToken, 30);

      setIsAuthenticated(true);
      setIsChecking(false);
    };

    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 初回マウント時のみ実行

  return { isAuthenticated, isChecking };
};
