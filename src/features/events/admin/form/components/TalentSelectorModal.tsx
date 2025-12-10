import React, { useState } from 'react';

interface TalentSelectorModalProps {
  talents: string[];
  onSave: (talents: string[]) => void;
  onClose: () => void;
}

const TalentSelectorModal: React.FC<TalentSelectorModalProps> = ({
  talents,
  onSave,
  onClose,
}) => {
  const [talentList, setTalentList] = useState<string[]>(
    talents.length > 0 ? talents : ['']
  );

  const handleAddTalent = () => {
    setTalentList([...talentList, '']);
  };

  const handleRemoveTalent = (index: number) => {
    if (talentList.length > 1) {
      setTalentList(talentList.filter((_, i) => i !== index));
    }
  };

  const handleTalentChange = (index: number, value: string) => {
    const newList = [...talentList];
    newList[index] = value;
    setTalentList(newList);
  };

  const handleSave = () => {
    // 空文字を除外して保存
    const filteredTalents = talentList.filter((t) => t.trim() !== '');
    if (filteredTalents.length === 0) {
      alert('少なくとも1つのタレント名を入力してください');
      return;
    }
    onSave(filteredTalents);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* ヘッダー */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">対象タレント選択</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* コンテンツ */}
        <div className="p-6">
          <div className="space-y-3">
            {talentList.map((talent, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={talent}
                  onChange={(e) => handleTalentChange(index, e.target.value)}
                  className="flex-1 px-3 py-2 border rounded"
                  placeholder="タレント名を入力"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveTalent(index)}
                  disabled={talentList.length === 1}
                  className={`px-4 py-2 rounded ${
                    talentList.length === 1
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-red-500 text-white hover:bg-red-600'
                  }`}
                >
                  削除
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleAddTalent}
            className="mt-4 w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            + タレントを追加
          </button>
        </div>

        {/* フッター */}
        <div className="border-t px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            キャンセル
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
};

export default TalentSelectorModal;
