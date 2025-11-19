import React from 'react';

interface LoginFormProps {
  email: string;
  password: string;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  errorMessage: string;
  warningMessage: string;
  loading: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  errorMessage,
  warningMessage,
  loading
}) => {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-amber-200 p-8 space-y-6">
        {/* ヘッダー */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-50 to-sky-50 rounded-full border border-amber-200">
              <span className="text-amber-600 text-xl">✦</span>
              <span className="text-amber-700 text-sm font-medium tracking-wider">LOGIN</span>
              <span className="text-sky-600 text-xl">✦</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800" style={{ fontFamily: "'Playfair Display', serif" }}>
            推し活サポート
          </h2>
          <p className="text-sm text-gray-600 font-light">
            ログインしてご利用ください
          </p>
        </div>

        {/* 装飾的な区切り線 */}
        <div className="flex items-center justify-center gap-3 opacity-40">
          <div className="w-12 h-px bg-gradient-to-r from-transparent to-amber-400" />
          <div className="w-2 h-2 bg-amber-400 rounded-full" />
          <div className="w-12 h-px bg-gradient-to-l from-transparent to-amber-400" />
        </div>

        {/* エラーメッセージ */}
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {errorMessage}
          </div>
        )}

        {/* 警告メッセージ */}
        {warningMessage && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg text-sm">
            {warningMessage}
          </div>
        )}

        {/* フォーム */}
        <form onSubmit={onSubmit} className="space-y-5">
          {/* メールアドレス */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              メールアドレス
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 outline-none"
              placeholder="example@example.com"
              required
              disabled={loading}
            />
          </div>

          {/* パスワード */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              パスワード
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 outline-none"
              placeholder="••••••••"
              required
              minLength={6}
              disabled={loading}
            />
          </div>

          {/* ログインボタン */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-lg hover:shadow-xl'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                ログイン中...
              </span>
            ) : (
              'ログイン'
            )}
          </button>
        </form>

        {/* フッターリンク */}
        <div className="pt-4 border-t border-gray-200 text-center space-y-2">
          <p className="text-xs text-gray-500">
            パスワードをお忘れの方は管理者にお問い合わせください
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
