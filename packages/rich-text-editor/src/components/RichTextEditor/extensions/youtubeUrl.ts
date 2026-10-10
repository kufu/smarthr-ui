import {
  getAttributesFromYoutubeEmbedUrl,
  getEmbedUrlFromYoutubeUrl,
  isValidYoutubeUrl,
} from '@tiptap/extension-youtube'

type NormalizedYoutubeUrl = {
  src: string
  /** URL に開始位置が含まれていた場合だけ持つ */
  start?: number
}

/**
 * 保存する YouTube の URL を `https://www.youtube.com/watch?v=ID`（再生リストは
 * `playlist?list=ID`）へ揃える。変換できない場合は null。
 *
 * 拡張が埋め込みを受け付ける表記（m./music. サブドメイン、プロトコル省略など）は、
 * 出力側の許可リストより広い。入力のまま保存すると、エディタでは表示されるのに
 * Viewer と HTML 出力では落ちるため、入力の時点でこの形へ寄せる。
 *
 * embed の URL で保存しないのは、getEmbedUrlFromYoutubeUrl が `/embed/` を含む URL を
 * そのまま返し、controls や rel の設定が付かなくなるため。
 * この形は拡張が iframe を読み込むときに作る src とも同じ。
 * embed の URL の `start` は src から消えるため、start 属性へ移せるよう返す。
 */
export const normalizeYoutubeUrl = (url: unknown): NormalizedYoutubeUrl | null => {
  if (typeof url !== 'string') return null

  const trimmed = url.trim()

  if (!isValidYoutubeUrl(trimmed)) return null

  // getAttributesFromYoutubeEmbedUrl は URL として解釈できないと null を返す
  const absolute = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed.replace(/^(https?:)?\/\//i, '')}`
  // youtu.be の URL は末尾をそのまま ID とみなすため、共有用のクエリを外す
  const withoutShareQuery = /^https:\/\/youtu\.be\//i.test(absolute)
    ? absolute.replace(/[?#].*$/, '')
    : absolute
  const embedUrl = getEmbedUrlFromYoutubeUrl({ url: withoutShareQuery, controls: true })

  if (!embedUrl) return null

  const attributes = getAttributesFromYoutubeEmbedUrl(
    embedUrl.replace(/^https:\/\/(?:m|music)\./i, 'https://www.'),
  )

  if (!attributes) return null

  const { src, start } = attributes

  return typeof start === 'number' && start >= 0 ? { src, start } : { src }
}
