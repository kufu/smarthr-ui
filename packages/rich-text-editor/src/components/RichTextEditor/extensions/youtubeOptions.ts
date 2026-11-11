import { parseNumericAttr } from '../serializers/safeAttributes'

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

/**
 * Editor・HTML 出力・Viewer の iframe に共通で付ける属性。
 *
 * 埋め込み先は正規化・検証した YouTube の URL に限定する。
 * YouTube プレイヤーとリンク先の動作互換性を優先し、sandbox は付けない。
 */
export const YOUTUBE_IFRAME_ATTRIBUTES = {
  allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
} as const

/**
 * 不正な寸法を落とすと iframe の width/height 属性ごと消えるため、
 * サニタイズで戻す先として拡張の設定と共有する。
 */
export const YOUTUBE_DEFAULT_SIZE = { width: 640, height: 360 } as const

// YouTube は埋め込みプレーヤーの表示領域に 200×200px 以上を求める
export const YOUTUBE_MIN_SIZE = { width: 356, height: 200 } as const

export const YOUTUBE_ASPECT_RATIO = { width: 16, height: 9 } as const

export const calcYoutubeHeight = (width: number): number =>
  Math.round((width * YOUTUBE_ASPECT_RATIO.height) / YOUTUBE_ASPECT_RATIO.width)

export const calcYoutubeWidth = (height: number): number =>
  Math.round((height * YOUTUBE_ASPECT_RATIO.width) / YOUTUBE_ASPECT_RATIO.height)

/**
 * iframe の height 属性は img と違って aspect-ratio に置き換わらず、幅だけが縮んで黒帯が出る。
 * height を auto にして aspect-ratio を効かせる。
 */
export const toYoutubeIframeSizeStyle = (width: unknown, height: unknown): string | null => {
  const w = parseNumericAttr(width)
  const h = parseNumericAttr(height)

  return w && h ? `max-width: 100%; height: auto; aspect-ratio: ${w} / ${h}` : null
}
