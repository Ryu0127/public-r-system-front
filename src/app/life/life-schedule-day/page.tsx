import type { Metadata } from 'next';
import ClientOnly from 'components/ClientOnly';
import { buildPageMetadata } from 'config/metadata';
import LifeScheduleDayContainer from 'features/life/life-schedule-day/containers/LifeScheduleDayContainer';

export const metadata: Metadata = buildPageMetadata({
  title: '日次スケジュール | ホロリスの推し活サポート',
  description: '日別の生活スケジュールを管理。推し活と日常生活を両立させるための時間管理ツール。',
  path: '/life/life-schedule-day',
});

/**
 * 日次スケジュール画面
 *
 * URL: /life/life-schedule-day
 * クエリ: ?usageYmd={YYYY-MM-DD} 表示日
 */
export default function LifeScheduleDayPage() {
  return (
    <ClientOnly>
      <LifeScheduleDayContainer />
    </ClientOnly>
  );
}
