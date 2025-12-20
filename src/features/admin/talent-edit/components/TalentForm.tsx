import React, { useState } from 'react';
import { AdminTalent, GROUP_OPTIONS, TalentHashtag, SearchWorkGroup } from '../types';

interface TalentFormProps {
  talent?: AdminTalent;
  onSave: (talent: Partial<AdminTalent>) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

const TalentForm: React.FC<TalentFormProps> = ({ talent, onSave, onCancel, onDelete }) => {
  const [formData, setFormData] = useState<Partial<AdminTalent>>({
    talentName: '',
    talentNameEn: '',
    groupName: '',
    groupId: 1,
    twitterAccounts: [],
    hashtags: [],
    searchWorks: [],
    status: 'active',
    debutDate: '',
    birthday: '',
    affiliation: '',
    profile: '',
    profileImageUrl: '',
    officialUrl: '',
    youtubeChannelId: '',
    ...talent,
  });

  const [twitterAccountInput, setTwitterAccountInput] = useState('');
  const [hashtagInput, setHashtagInput] = useState({ tag: '', description: '' });
  const [searchWorkInput, setSearchWorkInput] = useState({ category: '', newCategoryName: '', keyword: '' });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const groupId = parseInt(e.target.value);
    const selectedGroup = GROUP_OPTIONS.find((g) => g.id === groupId);
    setFormData((prev) => ({
      ...prev,
      groupId,
      groupName: selectedGroup?.name || '',
    }));
  };

  const handleAddTwitterAccount = () => {
    const account = twitterAccountInput.trim().replace(/^@/, '');
    if (account && !formData.twitterAccounts?.includes(account)) {
      setFormData((prev) => ({
        ...prev,
        twitterAccounts: [...(prev.twitterAccounts || []), account],
      }));
      setTwitterAccountInput('');
    }
  };

  const handleRemoveTwitterAccount = (account: string) => {
    setFormData((prev) => ({
      ...prev,
      twitterAccounts: (prev.twitterAccounts || []).filter((a) => a !== account),
    }));
  };

  const handleAddHashtag = () => {
    const hashtag = hashtagInput.tag.trim().replace(/^#/, '');
    const description = hashtagInput.description.trim();
    if (hashtag && description) {
      const newHashtag: TalentHashtag = { hashtag, description };
      setFormData((prev) => ({
        ...prev,
        hashtags: [...(prev.hashtags || []), newHashtag],
      }));
      setHashtagInput({ tag: '', description: '' });
    }
  };

  const handleRemoveHashtag = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      hashtags: (prev.hashtags || []).filter((_, i) => i !== index),
    }));
  };

  const handleAddSearchWork = () => {
    // 新規カテゴリの場合は newCategoryName を使用、それ以外は選択されたカテゴリを使用
    const category = searchWorkInput.category === '__NEW__'
      ? searchWorkInput.newCategoryName.trim()
      : searchWorkInput.category.trim();
    const keyword = searchWorkInput.keyword.trim();

    if (category && keyword) {
      setFormData((prev) => {
        const existingGroup = prev.searchWorks?.find(g => g.gropuName === category);

        if (existingGroup) {
          // 既存のカテゴリにキーワードを追加
          if (!existingGroup.keywords.includes(keyword)) {
            return {
              ...prev,
              searchWorks: prev.searchWorks?.map(g =>
                g.gropuName === category
                  ? { ...g, keywords: [...g.keywords, keyword] }
                  : g
              ),
            };
          }
          return prev; // 既に存在する場合は何もしない
        } else {
          // 新しいカテゴリを作成
          const newSearchWork: SearchWorkGroup = { gropuName: category, keywords: [keyword] };
          return {
            ...prev,
            searchWorks: [...(prev.searchWorks || []), newSearchWork],
          };
        }
      });

      // 新規カテゴリの場合は、カテゴリ選択を保持してnewCategoryNameとkeywordをクリア
      // 既存カテゴリの場合は、カテゴリ選択を保持してkeywordのみクリア
      setSearchWorkInput({
        category: searchWorkInput.category,
        newCategoryName: '',
        keyword: ''
      });
    }
  };

  const handleRemoveSearchWork = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      searchWorks: (prev.searchWorks || []).filter((_, i) => i !== index),
    }));
  };

  const handleAddKeywordToSearchWork = (groupIndex: number, keyword: string) => {
    const trimmedKeyword = keyword.trim();
    if (trimmedKeyword && formData.searchWorks) {
      const updatedSearchWorks = [...formData.searchWorks];
      if (!updatedSearchWorks[groupIndex].keywords.includes(trimmedKeyword)) {
        updatedSearchWorks[groupIndex].keywords.push(trimmedKeyword);
        setFormData((prev) => ({
          ...prev,
          searchWorks: updatedSearchWorks,
        }));
      }
    }
  };

  const handleRemoveKeywordFromSearchWork = (groupIndex: number, keywordIndex: number) => {
    if (formData.searchWorks) {
      const updatedSearchWorks = [...formData.searchWorks];
      updatedSearchWorks[groupIndex].keywords = updatedSearchWorks[groupIndex].keywords.filter(
        (_, i) => i !== keywordIndex
      );
      setFormData((prev) => ({
        ...prev,
        searchWorks: updatedSearchWorks,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleDeleteClick = () => {
    if (onDelete && window.confirm('本当に削除しますか？')) {
      onDelete();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 基本情報 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">基本情報</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              タレント名（日本語） <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="talentName"
              value={formData.talentName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded"
              placeholder="ときのそら"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              タレント名（英語） <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="talentNameEn"
              value={formData.talentNameEn}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded"
              placeholder="Tokino Sora"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              グループ <span className="text-red-500">*</span>
            </label>
            <select
              name="groupId"
              value={formData.groupId}
              onChange={handleGroupChange}
              required
              className="w-full px-4 py-2 border rounded"
            >
              {GROUP_OPTIONS.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">ステータス</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
            >
              <option value="active">活動中</option>
              <option value="inactive">休止中</option>
              <option value="graduated">卒業</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">デビュー日</label>
            <input
              type="date"
              name="debutDate"
              value={formData.debutDate}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">誕生日（MM-DD）</label>
            <input
              type="text"
              name="birthday"
              value={formData.birthday}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
              placeholder="05-20"
              pattern="[0-1][0-9]-[0-3][0-9]"
            />
          </div>
        </div>
      </div>

      {/* Twitterアカウント */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Twitterアカウント</h2>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={twitterAccountInput}
            onChange={(e) => setTwitterAccountInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTwitterAccount())}
            placeholder="アカウント名（@なし）"
            className="flex-1 px-4 py-2 border rounded"
          />
          <button
            type="button"
            onClick={handleAddTwitterAccount}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            追加
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {formData.twitterAccounts?.map((account, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded"
            >
              <span>@{account}</span>
              <button
                type="button"
                onClick={() => handleRemoveTwitterAccount(account)}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ハッシュタグ */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">ハッシュタグ</h2>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={hashtagInput.tag}
            onChange={(e) => setHashtagInput({ ...hashtagInput, tag: e.target.value })}
            placeholder="ハッシュタグ（#なし）"
            className="w-1/3 px-4 py-2 border rounded"
          />
          <input
            type="text"
            value={hashtagInput.description}
            onChange={(e) => setHashtagInput({ ...hashtagInput, description: e.target.value })}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddHashtag())}
            placeholder="説明"
            className="flex-1 px-4 py-2 border rounded"
          />
          <button
            type="button"
            onClick={handleAddHashtag}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            追加
          </button>
        </div>

        <div className="space-y-2">
          {formData.hashtags?.map((hashtag, index) => (
            <div
              key={index}
              className="flex items-start justify-between bg-purple-50 px-4 py-3 rounded border border-purple-200"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-purple-700 text-base">#{hashtag.hashtag}</span>
                </div>
                <div className="text-sm text-gray-700">
                  {hashtag.description}
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveHashtag(index)}
                className="text-red-500 hover:text-red-700 font-bold text-xl ml-4"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* タレント別検索ワード */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">タレント別検索ワード</h2>
        <p className="text-sm text-gray-600 mb-4">
          エゴサーチ機能で使用する、タレント別の検索ワードをカテゴリごとに登録できます。<br />
          同じカテゴリに複数のキーワードを登録する場合は、カテゴリを選択してキーワードを1つずつ追加してください。
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex gap-2">
            <select
              value={searchWorkInput.category}
              onChange={(e) => setSearchWorkInput({ ...searchWorkInput, category: e.target.value, newCategoryName: '' })}
              className="w-1/3 px-4 py-2 border rounded"
            >
              <option value="">カテゴリを選択</option>
              {Array.from(new Set(formData.searchWorks?.map(g => g.gropuName) || [])).map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
              <option value="__NEW__">+ 新規カテゴリ</option>
            </select>
            <input
              type="text"
              value={searchWorkInput.keyword}
              onChange={(e) => setSearchWorkInput({ ...searchWorkInput, keyword: e.target.value })}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSearchWork())}
              placeholder="キーワード（例: そらちゃん）"
              className="flex-1 px-4 py-2 border rounded"
            />
            <button
              type="button"
              onClick={handleAddSearchWork}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              追加
            </button>
          </div>
          {searchWorkInput.category === '__NEW__' && (
            <div className="flex gap-2">
              <div className="w-1/3"></div>
              <input
                type="text"
                value={searchWorkInput.newCategoryName}
                onChange={(e) => setSearchWorkInput({ ...searchWorkInput, newCategoryName: e.target.value })}
                placeholder="新しいカテゴリ名（例: タレント、イベント、ハッピーワード）"
                className="flex-1 px-4 py-2 border rounded bg-yellow-50"
              />
              <div className="px-4 py-2 opacity-0">追加</div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {formData.searchWorks?.map((group, groupIndex) => (
            <div
              key={groupIndex}
              className="bg-green-50 px-4 py-3 rounded border border-green-200"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <span className="font-bold text-green-700 text-base">{group.gropuName}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveSearchWork(groupIndex)}
                  className="text-red-500 hover:text-red-700 font-bold text-xl ml-4"
                >
                  ×
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                {group.keywords.map((keyword, keywordIndex) => (
                  <div
                    key={keywordIndex}
                    className="flex items-center gap-2 bg-white text-green-700 px-3 py-1 rounded border border-green-300"
                  >
                    <span>{keyword}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveKeywordFromSearchWork(groupIndex, keywordIndex)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  placeholder="キーワードを追加"
                  className="flex-1 px-3 py-1 border rounded text-sm"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddKeywordToSearchWork(groupIndex, (e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 追加情報 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">追加情報</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">所属</label>
            <input
              type="text"
              name="affiliation"
              value={formData.affiliation}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
              placeholder="ホロライブプロダクション"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">プロフィール</label>
            <textarea
              name="profile"
              value={formData.profile}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border rounded"
              placeholder="タレントのプロフィールを入力"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">公式サイトURL</label>
            <input
              type="url"
              name="officialUrl"
              value={formData.officialUrl}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
              placeholder="https://www.hololive.tv/..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">YouTubeチャンネルID</label>
            <input
              type="text"
              name="youtubeChannelId"
              value={formData.youtubeChannelId}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
              placeholder="UCp6993wxpyDPHUpavwDFqgg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">プロフィール画像URL</label>
            <input
              type="url"
              name="profileImageUrl"
              value={formData.profileImageUrl}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
              placeholder="https://..."
            />
          </div>
        </div>
      </div>

      {/* フォームアクション */}
      <div className="flex justify-between items-center">
        <div>
          {onDelete && talent && (
            <button
              type="button"
              onClick={handleDeleteClick}
              className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              削除
            </button>
          )}
        </div>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            キャンセル
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            保存
          </button>
        </div>
      </div>
    </form>
  );
};

export default TalentForm;
