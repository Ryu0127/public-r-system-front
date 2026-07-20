import React from 'react';

interface FavoriteButtonProps {
  isFavorite: boolean;
  label: string;
  onToggle: () => void;
  disabled?: boolean;
}

/**
 * お気に入りトグルボタン
 */
const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  isFavorite,
  label,
  onToggle,
  disabled = false,
}) => {
  return (
    <button
      type="button"
      className={`fav-btn${isFavorite ? ' is-on' : ''}`}
      aria-pressed={isFavorite}
      aria-label={
        isFavorite ? `${label}のお気に入りを解除` : `${label}をお気に入りに追加`
      }
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
          d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
          fill={isFavorite ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
};

export default FavoriteButton;
