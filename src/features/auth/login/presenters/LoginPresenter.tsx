import React from 'react';
import LoginForm from '../components/LoginForm';
import { LoginState, LoginActions } from '../hooks/useLoginState';

interface LoginPresenterProps {
  state: LoginState;
  actions: LoginActions;
}

const LoginPresenter: React.FC<LoginPresenterProps> = ({ state, actions }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-amber-50 relative overflow-hidden flex items-center justify-center">
      {/* 背景装飾 */}
      <div className="absolute top-20 right-20 w-32 h-32 border-4 border-amber-200 rounded-full opacity-20 animate-spin-slow" />
      <div
        className="absolute bottom-20 left-20 w-40 h-40 border-4 border-sky-200 rounded-full opacity-20 animate-spin"
        style={{ animationDuration: '15s' }}
      />

      {/* メインコンテンツ */}
      <div className="relative z-10 w-full px-4 py-16">
        <LoginForm
          email={state.email}
          password={state.password}
          onEmailChange={actions.setEmail}
          onPasswordChange={actions.setPassword}
          onSubmit={actions.handleSubmit}
          errorMessage={state.errorMessage}
          warningMessage={state.warningMessage}
          loading={state.loading}
        />
      </div>

      {/* 装飾的なアイコン列（下部） */}
      <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-6 text-4xl opacity-10">
        <span className="text-amber-500">✦</span>
        <span className="text-sky-500">◆</span>
        <span className="text-emerald-500">✧</span>
        <span className="text-amber-500">◆</span>
        <span className="text-sky-500">✦</span>
      </div>
    </div>
  );
};

export default LoginPresenter;
