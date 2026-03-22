import type { MusicTalent } from '../types';
import type { Talent } from 'hooks/api/oshi-katsu-saport/useTalentsGetApi';

/** タレント一覧APIの行を楽曲画面用の MusicTalent に変換 */
export function talentToMusicTalent(t: Talent): MusicTalent {
  const ja = t.talentName ?? '';
  const en = t.talentNameEn ?? '';
  return {
    id: String(t.id ?? '').trim(),
    talentName: ja,
    talentNameEn: en,
    talentNameJoin: ja && en ? `${ja}（${en}）` : ja || en,
    groupName: t.groupName ?? '',
    groupId: Number(t.groupId ?? 0),
  };
}
