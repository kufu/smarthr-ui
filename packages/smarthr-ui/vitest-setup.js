import '@testing-library/jest-dom/vitest'

// jsdom はレイアウトを計算しないため、ProseMirror (Tiptap) が
// scrollIntoView 経由で呼ぶ getClientRects / getBoundingClientRect が
// 環境によって未定義・空になり例外を投げる（テストの偽陽性の原因になる）。
// prosemirror の singleRect は getClientRects() が空だと getBoundingClientRect()
// にフォールバックするため、両方が常にダミー矩形を返すように上書きする。
const createFakeRect = () => ({
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: 0,
  height: 0,
  x: 0,
  y: 0,
  toJSON: () => ({}),
})

const installRectStubs = (proto) => {
  if (!proto) return

  const originalGetClientRects = proto.getClientRects
  proto.getClientRects = function getClientRects() {
    const rects = originalGetClientRects ? originalGetClientRects.call(this) : null
    // 実装があり中身が返る場合はそのまま使い、無い/空ならダミーを返す
    return rects && rects.length > 0 ? rects : [createFakeRect()]
  }

  const originalGetBoundingClientRect = proto.getBoundingClientRect
  proto.getBoundingClientRect = function getBoundingClientRect() {
    return originalGetBoundingClientRect
      ? originalGetBoundingClientRect.call(this)
      : createFakeRect()
  }
}

if (typeof Element !== 'undefined') installRectStubs(Element.prototype)
if (typeof Range !== 'undefined') installRectStubs(Range.prototype)
