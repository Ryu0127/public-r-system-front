import React from 'react';
import LoginPresenter from '../presenters/LoginPresenter';
import { useLoginState } from '../hooks/useLoginState';

const LoginContainer: React.FC = () => {
  const { state, actions } = useLoginState();

  return <LoginPresenter state={state} actions={actions} />;
};

export default LoginContainer;
