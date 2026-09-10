import { MusicOgPage } from './musicOgPages';

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export const buildOgHtml = (page: MusicOgPage, origin: string): string => {
  const title = escapeHtml(page.title);
  const description = escapeHtml(page.description);
  const keywords = escapeHtml(page.keywords);
  const pageUrl = escapeHtml(`${origin}${page.path}`);
  const imageUrl = escapeHtml(`${origin}${page.imagePath}`);
  const twitterImageUrl = escapeHtml(`${origin}${page.twitterImagePath}`);
  const imageWidth =
    page.imageWidth != null
      ? `\n<meta property="og:image:width" content="${page.imageWidth}" />`
      : '';
  const imageHeight =
    page.imageHeight != null
      ? `\n<meta property="og:image:height" content="${page.imageHeight}" />`
      : '';

  return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${title}</title>
<meta name="description" content="${description}" />
<meta name="keywords" content="${keywords}" />
<meta name="author" content="ホロリスの推し活サポート" />
<meta name="robots" content="index, follow" />
<link rel="canonical" href="${pageUrl}" />
<meta property="og:type" content="website" />
<meta property="og:url" content="${pageUrl}" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />
<meta property="og:image" content="${imageUrl}" />${imageWidth}${imageHeight}
<meta property="og:locale" content="ja_JP" />
<meta property="og:site_name" content="ホロリスの推し活サポート" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:url" content="${pageUrl}" />
<meta name="twitter:title" content="${title}" />
<meta name="twitter:description" content="${description}" />
<meta name="twitter:image" content="${twitterImageUrl}" />
<link rel="icon" href="/favicon.ico" />
</head>
<body>
<p>${title}</p>
</body>
</html>
`;
};
