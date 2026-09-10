import { buildOgHtml } from './src/og/buildOgHtml';
import { getMusicOgPage } from './src/og/musicOgPages';

export const config = {
  matcher: ['/music', '/music/'],
};

/**
 * Discord / X / LINE などのクローラーは SPA の JS を実行しない。
 * /music と /music?talent=tokino-sora だけ、専用 OG の静的 HTML を返す。
 * ブラウザ確認用: /music?talent=tokino-sora&og-preview=1
 */
const SOCIAL_CRAWLER_UA =
  /Twitterbot|facebookexternalhit|Facebot|Discordbot|Slackbot|TelegramBot|WhatsApp|LinkedInBot|Pinterest|Iframely|Embedly|redditbot|SkypeUriPreview|Viber|line-poker|SummalyBot|Bluesky Cardify|NotionEmbedder|PlurkBot|Tumblr|BitlyBot|Quora Link Preview|vkShare/i;

export default function middleware(request: Request): Response | void {
  const requestUrl = new URL(request.url);
  const userAgent = request.headers.get('user-agent') ?? '';
  const isOgPreview = requestUrl.searchParams.get('og-preview') === '1';

  if (!isOgPreview && !SOCIAL_CRAWLER_UA.test(userAgent)) {
    return;
  }

  const talentSlug = (requestUrl.searchParams.get('talent') ?? '').trim();
  const page = getMusicOgPage(talentSlug);

  return new Response(buildOgHtml(page, requestUrl.origin), {
    status: 200,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'public, s-maxage=600, stale-while-revalidate=86400',
    },
  });
}
