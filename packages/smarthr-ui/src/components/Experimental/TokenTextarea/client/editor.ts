/**
 * TokenTextarea の DOM と値(セグメント配列)を相互変換する、React に依存しない処理群。
 *
 * ## DOM
 *
 * ```html
 * <div>テキスト<img data-smarthr-ui-token="name" alt="氏名" src="(透明画像)" width="44" height="22">さん</div>
 * <div><br></div>   ← 空行
 * ```
 *
 * トークンは編集領域の中では透明な `<img>` で表し、見た目は編集領域の背面に別途描画する。
 * 画像はどのブラウザでも「1文字」として扱われるため、キャレット移動・選択・削除・undo などを
 * ブラウザ標準の挙動に任せられる。`contenteditable="false"` の要素をトークンにすると、
 * Safari で行頭のトークンから上下移動できない、行末のキャレットが行頭に描画されるなど、
 * ブラウザごとに挙動が揃わない。
 *
 * 1行は基本的に1つの `div` だが、ブラウザの編集によって `<br>` での改行などが混ざることがあるため、
 * 読み取りはブロック要素を行、`<br>` を改行として扱う。
 */

export type TokenTextareaToken = {
  /** テンプレートの置換時などに使う、トークンを識別する値 */
  value: string
  /** トークンの読み上げや、テキストとしてコピーした際に使う文字列 */
  label: string
}

/** 値を構成する要素。値はこの配列で表す */
export type TokenTextareaSegment = string | TokenTextareaToken

type TokenTextareaValue = TokenTextareaSegment[]

const TOKEN_ATTR = 'data-smarthr-ui-token'
export const TOKEN_SELECTOR = `img[${TOKEN_ATTR}]`

// 1x1 の透明な GIF。サイズは背面に描画した見た目に合わせて width/height で指定する
const TRANSPARENT_IMAGE =
  'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='

const IGNORED_ELEMENTS = new Set(['STYLE', 'SCRIPT', 'HEAD', 'TEMPLATE', 'META', 'TITLE'])
const BLOCK_ELEMENTS = new Set(['DIV', 'P', 'LI', 'UL', 'OL', 'BLOCKQUOTE', 'PRE', 'TR'])

const isToken = (segment: TokenTextareaSegment): segment is TokenTextareaToken =>
  typeof segment !== 'string'

/** 空文字を除き、隣り合う文字列を結合する */
export const normalizeValue = (value: TokenTextareaValue): TokenTextareaValue =>
  value.reduce<TokenTextareaValue>((result, segment) => {
    const last = result[result.length - 1]

    if (isToken(segment)) {
      result.push({ value: segment.value, label: segment.label })
    } else if (segment && typeof last === 'string') {
      result[result.length - 1] = last + segment
    } else if (segment) {
      result.push(segment)
    }

    return result
  }, [])

export const isSameValue = (a: TokenTextareaValue, b: TokenTextareaValue) =>
  JSON.stringify(normalizeValue(a)) === JSON.stringify(normalizeValue(b))

export const toPlainText = (value: TokenTextareaValue) =>
  value.map((segment) => (isToken(segment) ? segment.label : segment)).join('')

export const readToken = (element: Element): TokenTextareaToken => ({
  value: element.getAttribute(TOKEN_ATTR) ?? '',
  label: element.getAttribute('alt') ?? '',
})

/** DOM から値を読み取る。貼り付けられた HTML のように崩れた DOM も読める */
export const readValue = (root: Node): TokenTextareaValue => {
  const result: TokenTextareaValue = []
  // 行の途中かどうか。ブロック要素の開始時に改行が必要かの判定に使う
  let inLine = false
  // 最後に出たのが <br> か。ブロック末尾の <br> は改行ではなく、空行などの高さを保つためのもの
  let trailingBr = false

  const visit = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.nodeValue ?? ''

      if (text) {
        result.push(text)
        inLine = !text.endsWith('\n')
        trailingBr = false
      }

      return
    }

    if (!(node instanceof Element) || IGNORED_ELEMENTS.has(node.tagName)) {
      return
    }

    if (node.matches(TOKEN_SELECTOR)) {
      result.push(readToken(node))
      inLine = true
      trailingBr = false

      return
    }

    if (node.tagName === 'BR') {
      result.push('\n')
      inLine = false
      trailingBr = true

      return
    }

    const isBlock = BLOCK_ELEMENTS.has(node.tagName)

    if (isBlock) {
      if (inLine) {
        result.push('\n')
      }

      inLine = false
      trailingBr = false
    }

    node.childNodes.forEach(visit)

    if (isBlock) {
      if (trailingBr) {
        result.pop()
      }

      // 空のブロックも1行として扱うため、次の内容の前で改行させる
      inLine = true
      trailingBr = false
    }
  }

  root.childNodes.forEach(visit)

  return normalizeValue(result)
}

const escapeHtml = (text: string) =>
  text.replace(
    /[&<>"']/g,
    (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!,
  )

const toTokenHtml = (token: TokenTextareaToken) =>
  `<img ${TOKEN_ATTR}="${escapeHtml(token.value)}" alt="${escapeHtml(token.label)}" src="${TRANSPARENT_IMAGE}">`

/** 値を1行1つの div の HTML にする。編集領域の描画・挿入・クリップボードで使う */
export const toHtml = (value: TokenTextareaValue) => {
  const lines = ['']

  for (const segment of value) {
    if (isToken(segment)) {
      lines[lines.length - 1] += toTokenHtml(segment)
    } else {
      segment.split('\n').forEach((text, i) => {
        if (i > 0) {
          lines.push('')
        }

        lines[lines.length - 1] += escapeHtml(text)
      })
    }
  }

  return lines.map((line) => `<div>${line || '<br>'}</div>`).join('')
}

/** 行をまたがない値を、挿入用の HTML にする */
export const toInlineHtml = (value: TokenTextareaValue) =>
  value.map((segment) => (isToken(segment) ? toTokenHtml(segment) : escapeHtml(segment))).join('')

/**
 * クリップボードやドロップなど、外部から来た値のトークンを検証する。
 * 外部の HTML は `data-smarthr-ui-token` 属性を書くだけでトークンを偽装できるため、
 * 信頼できない場合は `allowed` にある value のみトークンとして残し、ラベルも `allowed` のものに置き換える。
 * それ以外はラベルの文字列として取り込む
 */
export const verifyTokens = (
  value: TokenTextareaValue,
  allowed: TokenTextareaToken[] | undefined,
  trusted: boolean,
): TokenTextareaValue =>
  normalizeValue(
    value.map((segment) => {
      if (!isToken(segment) || trusted) {
        return segment
      }

      const found = allowed?.find((token) => token.value === segment.value)

      return found ? { value: found.value, label: found.label } : segment.label
    }),
  )

export const readClipboard = (data: DataTransfer | null): TokenTextareaValue | null => {
  if (!data) {
    return null
  }

  const html = data.getData('text/html')

  // HINT: TokenTextarea からコピーした内容のみ HTML として読む。それ以外は書式を捨ててテキストとして扱う
  if (html && html.includes(TOKEN_ATTR) && typeof DOMParser !== 'undefined') {
    return readValue(new DOMParser().parseFromString(html, 'text/html').body)
  }

  const text = data.getData('text/plain')

  return text ? [text.replace(/\r\n?/g, '\n')] : null
}
