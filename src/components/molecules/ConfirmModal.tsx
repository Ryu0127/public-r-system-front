import React from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  /** 確認内容の本文 */
  children: React.ReactNode;
}

/**
 * 実行前の確認モーダル（キャンセル / 実行の2ボタン）
 */
const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  confirmLabel,
  cancelLabel = 'キャンセル',
  onConfirm,
  onCancel,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10001] bg-black/50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-3">{title}</h3>
        <div className="text-sm text-gray-600 mb-5">{children}</div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 rounded-lg bg-[#1DA1F2] text-white hover:bg-[#0d8bd9]"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
