/**
 * targetが、nodeの属するポータル系列(nodeを含むPortalが生成した要素、またはその祖先ポータル)の
 * 子孫かどうかを判定する。nodeにはPortalの中身に含まれる任意の要素を渡せば良い。
 */
export function isChildPortal(target: HTMLElement | SVGElement | null, node: HTMLElement): boolean {
  const seq = node.closest<HTMLElement>('[data-portal-current-seq]')?.dataset.portalCurrentSeq

  if (seq === undefined) {
    return false
  }

  return _isDescendantOfSeq(target, Number(seq))
}

function _isDescendantOfSeq(element: HTMLElement | SVGElement | null, seq: number): boolean {
  if (!element) return false

  const childOf = element.dataset?.portalChildOf
  const includesSeq = childOf !== undefined && new RegExp(`(^|,)${seq}(,|$)`).test(childOf)

  return includesSeq || _isDescendantOfSeq(element.parentElement, seq)
}
