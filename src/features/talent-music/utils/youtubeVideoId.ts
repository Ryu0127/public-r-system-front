const YOUTUBE_VIDEO_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;

/** YouTube 動画ID として妥当か */
export const isValidYoutubeVideoId = (videoId: string | null | undefined): videoId is string =>
  typeof videoId === 'string' && YOUTUBE_VIDEO_ID_PATTERN.test(videoId.trim());
