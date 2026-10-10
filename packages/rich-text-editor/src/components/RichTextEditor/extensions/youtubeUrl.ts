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

const SHARE_TIME = /^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s?)?$/i

/** 拡張は embed の URL の start しか読まず、共有 URL の t（`1m30s` など）を引き継げないため自前で読む */
const parseShareTime = (url: string): number | undefined => {
  let parsed: URL

  try {
    parsed = new URL(url)
  } catch {
    return undefined
  }

  const candidates = [
    parsed.searchParams.get('t'),
    new URLSearchParams(parsed.hash.slice(1)).get('t'),
  ]

  for (const t of candidates) {
    const match = t ? SHARE_TIME.exec(t) : null

    if (match) {
      const [hours, minutes, seconds] = match.slice(1).map((part) => Number(part ?? 0))
      const total = hours * 3600 + minutes * 60 + seconds

      // 桁の多い値は Infinity や指数表記になり、埋め込みの URL を壊す
      if (Number.isSafeInteger(total)) return total
    }
  }

  return undefined
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

  const { src } = attributes
  const start = attributes.start ?? parseShareTime(absolute)

  return typeof start === 'number' && start >= 0 ? { src, start } : { src }
}
