const STORAGE_KEY = 'talentSelection';

/**
 * 画面をまたいで共有するタレント選択状態
 * （遷移はフルリロードのため sessionStorage で保持する）
 */
export interface TalentSelection {
  /** 選択中タレントの slug（未選択は null） */
  talentSlug: string | null;
  /** 選択中グループの ID（未選択は null） */
  groupId: number | null;
}

const EMPTY_SELECTION: TalentSelection = { talentSlug: null, groupId: null };

export const loadTalentSelection = (): TalentSelection => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_SELECTION;
    const parsed = JSON.parse(raw) as Partial<TalentSelection>;
    return {
      talentSlug: typeof parsed.talentSlug === 'string' && parsed.talentSlug ? parsed.talentSlug : null,
      groupId: typeof parsed.groupId === 'number' ? parsed.groupId : null,
    };
  } catch {
    return EMPTY_SELECTION;
  }
};

export const saveTalentSelection = (selection: TalentSelection): void => {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(selection));
  } catch {
    // sessionStorage が使えない環境では選択状態を持ち越さない
  }
};
