/**
 * 静的HTML（public/event など）向け Google Analytics。
 * React 画面の REACT_APP_GA_MEASUREMENT_ID と同じ Measurement ID を使う。
 * iframe 内では親の react-ga4 が計測するため、ここでは送信しない。
 */
(function () {
  var MEASUREMENT_ID = 'G-8G6DJRYZTX';
  if (!MEASUREMENT_ID || window.self !== window.top) {
    return;
  }

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;

  var script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + MEASUREMENT_ID;
  document.head.appendChild(script);

  gtag('js', new Date());
  var pagePath = location.pathname.replace(/\/index\.html$/, '').replace(/\/+$/, '') || '/';
  gtag('config', MEASUREMENT_ID, { page_path: pagePath });
})();
