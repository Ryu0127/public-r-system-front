import type { Metadata } from 'next';
import SimplePageViewerContainer from 'features/simple-pages/containers/SimplePageViewerContainer';

export const metadata: Metadata = {
  title: 'ページが見つかりません',
};

/** 未登録の slug（HTTP 404 で「ページが見つかりません」を表示） */
export default function EventNotFound() {
  return <SimplePageViewerContainer />;
}
