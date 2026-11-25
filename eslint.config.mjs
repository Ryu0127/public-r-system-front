import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';

const eslintConfig = [
  ...nextCoreWebVitals,
  {
    // CRA（eslint-config-react-app）時代には無かったルールで、既存コードに多数該当するもの。
    // 移行時点ではエラーにせず警告として可視化し、段階的に解消する。
    rules: {
      'react-hooks/refs': 'warn',
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/immutability': 'warn',
      'react-hooks/preserve-manual-memoization': 'warn',
      'react/jsx-key': 'warn',
      'react/no-unescaped-entities': 'warn',
      // サイト内遷移の一部は意図的にフルリロード（sessionStorage で状態を持ち越す設計）
      '@next/next/no-html-link-for-pages': 'warn',
    },
  },
  {
    ignores: ['.next/**', 'node_modules/**', 'build/**', 'next-env.d.ts'],
  },
];

export default eslintConfig;
