import type { Metadata } from 'next';
import ClientOnly from 'components/ClientOnly';
import { buildPageMetadata } from 'config/metadata';
import LifeScheduleMonthContainer from 'features/life/life-schedule-month/containers/LifeScheduleMonthContainer';

export const metadata: Metadata = buildPageMetadata({
  title: '月次スケジュール | ホロリスの推し活サポート',
  description:
    '月別の生活スケジュールを管理。1ヶ月の予定を一覧で確認し、推し活と日常生活を効率的に計画できます。',
  path: '/life/life-schedule-month',
});

/**
 * 月次スケジュール画面
 *
 * URL: /life/life-schedule-month
 * クエリ: ?yearMonth={YYYY-MM} 表示月
 */
export default function LifeScheduleMonthPage() {
  return (
    <ClientOnly>
      <LifeScheduleMonthContainer />
    </ClientOnly>
  );
}
