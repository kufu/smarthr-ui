import type { Node as ProseMirrorNode } from '@tiptap/pm/model'

/** doc 内の image ノードの src を出現順に列挙する（重複も保持）。 */
export const collectImageSrcs = (doc: ProseMirrorNode): string[] => {
  const srcs: string[] = []
  doc.descendants((node) => {
    if (node.type.name === 'image') {
      const src = node.attrs.src
      if (typeof src === 'string' && src !== '') {
        srcs.push(src)
      }
    }
  })
  return srcs
}

/** before/after の src 配列から「正味で消えた src」を多重集合差分で返す。 */
export const diffRemovedSrcs = (before: string[], after: string[]): string[] => {
  const afterCounts = new Map<string, number>()
  for (const s of after) {
    afterCounts.set(s, (afterCounts.get(s) ?? 0) + 1)
  }
  const removed: string[] = []
  for (const s of before) {
    const c = afterCounts.get(s) ?? 0
    if (c > 0) {
      afterCounts.set(s, c - 1) // matched an after-occurrence
    } else {
      removed.push(s) // net removal
    }
  }
  return removed
}
