import React from 'react';
import { Talent } from 'hooks/api/oshi-katsu-saport/useTalentsGetApi';
import { HomeTalentGroup } from '../hooks/useOshiKatsuSaportState';
import SectionTitle from 'components/molecules/SectionTitle';
import TalentAvatar from 'components/atoms/TalentAvatar';

interface TalentShowcaseSectionProps {
  talentGroups: HomeTalentGroup[];
  selectedTalent: Talent | null;
  selectedGroupId: number | null;
  onSelectTalent: (talent: Talent) => void;
  onClearSelection: () => void;
  onSelectGroup: (groupId: number) => void;
}

const TalentShowcaseSection: React.FC<TalentShowcaseSectionProps> = ({
  talentGroups,
  selectedTalent,
  selectedGroupId,
  onSelectTalent,
  onClearSelection,
  onSelectGroup,
}) => {
  if (talentGroups.length === 0) {
    return null;
  }

  // 表示するグループ（未指定時は先頭グループ）
  const displayedGroup =
    talentGroups.find((g) => g.groupId === selectedGroupId) ?? talentGroups[0];

  return (
    <section className="space-y-8">
      {/* セクションタイトル */}
      <SectionTitle en="Talent" ja="タレント一覧" />

      {/* タレント選択の案内 */}
      <div className="max-w-2xl mx-auto">
        <div className="flex items-start gap-4 px-5 py-3.5 bg-white/80 border border-sky-200 rounded-2xl shadow-sm text-left">
          <span className="text-sky-500 text-2xl leading-none mt-0.5 animate-star-twinkle inline-block">✦</span>
          <div className="min-w-0">
            <p className="text-sm font-bold text-sky-700">タレント選択モード</p>
            <p className="text-xs text-gray-600 leading-relaxed mt-1">
              タレントを選択することで、タレントに紐づく情報をピックアップして表示することができます。
            </p>
          </div>
        </div>
      </div>

      {/* タレントグリッド */}
      <div className="flex flex-wrap justify-center gap-3 md:gap-4">
        {displayedGroup.talents.map((talent) => {
          const isSelected = talent.id === selectedTalent?.id;
          return (
            <button
              key={talent.id}
              type="button"
              onClick={() => (isSelected ? onClearSelection() : onSelectTalent(talent))}
              className={`group flex flex-col items-center gap-2 w-36 p-4 rounded-2xl transition-all duration-200 text-center ${
                isSelected
                  ? 'bg-white ring-2 ring-amber-400 shadow-lg'
                  : 'hover:bg-white/70 hover:shadow-md'
              }`}
            >
              <TalentAvatar
                id={talent.id}
                name={talent.talentName}
                iconImgUrl={talent.iconImgUrl}
                sizeClass="w-28 h-28"
                initialTextClass="text-2xl"
              />
              <span
                className={`text-xs font-semibold leading-snug break-words w-full ${
                  isSelected ? 'text-amber-600' : 'text-gray-800'
                }`}
              >
                {talent.talentName}
              </span>
              <span className="text-xs text-gray-400 leading-snug break-words w-full">
                {talent.talentNameEn}
              </span>
              {isSelected && (
                <span className="text-[10px] bg-amber-500 text-white px-2 py-0.5 rounded-full font-medium">
                  選択中
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* グループ切り替え */}
      <div className="flex justify-center">
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <span className="font-medium">グループ</span>
          <select
            value={displayedGroup.groupId}
            onChange={(e) => onSelectGroup(Number(e.target.value))}
            className="px-4 py-2.5 bg-white/90 border border-gray-200 rounded-xl shadow-sm text-sm text-gray-800 focus:border-sky-400 focus:outline-none transition-colors cursor-pointer"
          >
            {talentGroups.map((group) => (
              <option key={group.groupId} value={group.groupId}>
                {group.groupName}
              </option>
            ))}
          </select>
        </label>
      </div>
    </section>
  );
};

export default TalentShowcaseSection;
