/**
 * 埋め込みURLの組み立てに影響する設定。
 *
 * Editor は Youtube 拡張の renderHTML が、Viewer は serializeToReactElement が
 * それぞれ getEmbedUrlFromYoutubeUrl を呼ぶため、同じ値を渡さないと src がずれる。
 * controls と rel は拡張の既定値だが、未指定にすると `controls=0` が付いたり
 * `rel=1` が落ちたりしてURLが変わるため明示する。
 */
export const YOUTUBE_EMBED_OPTIONS = {
  nocookie: true,
  allowFullscreen: true,
  controls: true,
  rel: 1,
} as const
