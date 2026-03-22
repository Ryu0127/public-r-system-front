import type { MusicTalent } from '../types';
import type { Talent } from 'hooks/api/oshi-katsu-saport/useTalentsGetApi';

function parseNumericId(raw: string): number {
  const n = Number(raw);
  return Number.isFinite(n) ? n : 0;
}

/** タレント一覧APIの行を楽曲画面用の MusicTalent に変換 */
export function talentToMusicTalent(t: Talent): MusicTalent {
  const ja = t.talentName ?? '';
  const en = t.talentNameEn ?? '';
  return {
    id: parseNumericId(String(t.id ?? '')),
    talentName: ja,
    talentNameEn: en,
    talentNameJoin: ja && en ? `${ja}（${en}）` : ja || en,
    groupName: t.groupName ?? '',
    groupId: Number(t.groupId ?? 0),
  };
}
