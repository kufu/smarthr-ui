import '@testing-library/jest-dom/vitest'

// jsdom はレイアウト系 API を実装していないため、ProseMirror (Tiptap) が
// トランザクション適用時に呼ぶ scrollIntoView 経由の getClientRects で例外が出る。
// テストの偽陽性を防ぐため no-op / 空矩形を返すモックを補う。
if (typeof Element !== 'undefined' && !Element.prototype.getClientRects) {
  Element.prototype.getClientRects = function getClientRects() {
    return []
  }
}
if (typeof Range !== 'undefined' && !Range.prototype.getClientRects) {
  Range.prototype.getClientRects = function getClientRects() {
    return []
  }
}
