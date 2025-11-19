import { useState } from 'react';
import { useLoginPostApi, LoginApiRequest } from 'hooks/api/auth/useLoginPostApi';
import { useNavigate, useLocation } from 'react-router-dom';
import { setCookie } from 'utils/cookieUtil';

export interface LoginState {
  email: string;
  password: string;
  errorMessage: string;
  warningMessage: string;
  loading: boolean;
}

export interface LoginActions {
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

export const useLoginState = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { executeLogin, loading } = useLoginPostApi();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [warningMessage, setWarningMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setWarningMessage('');

    const requestParam: LoginApiRequest = {
      email,
      password
    };

    const { apiResponse, error } = await executeLogin(requestParam);

    if (error) {
      setErrorMessage('ネットワークエラーが発生しました。もう一度お試しください。');
      return;
    }

    if (apiResponse) {
      if (apiResponse.status && apiResponse.data) {
        // ログイン成功
        // 認証トークンをlocalStorageに保存
        localStorage.setItem('token', apiResponse.data.token);

        // 自動ログイントークンをクッキーに保存
        setCookie('autoLoginToken', apiResponse.data.autoLoginToken, 30);

        // 遷移元がある場合はそこへリダイレクト、なければホーム画面へ
        const from = (location.state as any)?.from || '/';
        navigate(from);
      } else {
        // ログイン失敗
        if (apiResponse.locked) {
          setErrorMessage(apiResponse.message || 'アカウントがロックされています。');
        } else if (apiResponse.warning) {
          setErrorMessage(apiResponse.message || 'メールアドレスまたはパスワードが正しくありません。');
          if (apiResponse.warningMessage) {
            setWarningMessage(apiResponse.warningMessage);
          }
        } else if (apiResponse.errors) {
          // バリデーションエラー
          const errorMessages = Object.values(apiResponse.errors).flat();
          setErrorMessage(errorMessages.join(' '));
        } else {
          setErrorMessage(apiResponse.message || 'ログインに失敗しました。');
        }
      }
    }
  };

  const state: LoginState = {
    email,
    password,
    errorMessage,
    warningMessage,
    loading
  };

  const actions: LoginActions = {
    setEmail,
    setPassword,
    handleSubmit
  };

  return { state, actions };
};
