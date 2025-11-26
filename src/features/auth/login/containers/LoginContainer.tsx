import React from 'react';
import { Helmet } from 'react-helmet-async';
import LoginPresenter from '../presenters/LoginPresenter';
import { useLoginState } from '../hooks/useLoginState';

const LoginContainer: React.FC = () => {
  const { state, actions } = useLoginState();

  return (
    <>
      <Helmet>
        <title>ログイン | ホロリスの推し活サポート</title>
        <meta name="description" content="ホロリスの推し活サポートにログインして、推し活をもっと楽しみましょう。" />
        <meta property="og:title" content="ログイン | ホロリスの推し活サポート" />
        <meta property="og:description" content="ホロリスの推し活サポートにログインして、推し活をもっと楽しみましょう。" />
        <meta property="og:url" content="https://public-r-system-front.vercel.app/login" />
        <link rel="canonical" href="https://public-r-system-front.vercel.app/login" />
      </Helmet>
      <LoginPresenter state={state} actions={actions} />
    </>
  );
};

export default LoginContainer;
