import React from 'react';

interface CoordinateFormProps {
  formData: {
    name: string;
    description: string;
    occasion: string;
    season: string;
  };
  onChange: (data: any) => void;
}

export const CoordinateForm: React.FC<CoordinateFormProps> = ({
  formData,
  onChange,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        コーディネート情報
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            コーディネート名 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => onChange({ ...formData, name: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="例: カジュアルデート服"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            説明
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              onChange({ ...formData, description: e.target.value })
            }
            rows={3}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="コーディネートの説明"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              シーン
            </label>
            <input
              type="text"
              value={formData.occasion}
              onChange={(e) =>
                onChange({ ...formData, occasion: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="例: デート、ビジネス"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              季節
            </label>
            <select
              value={formData.season}
              onChange={(e) =>
                onChange({ ...formData, season: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">選択してください</option>
              <option value="spring">春</option>
              <option value="summer">夏</option>
              <option value="autumn">秋</option>
              <option value="winter">冬</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
