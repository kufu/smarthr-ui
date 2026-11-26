// document.activeElement と比べないのは、Shadow DOM の中では影の外側の要素（ホスト）が返るため
export const isActiveElement = (element: Element | null) =>
  element !== null && (element.getRootNode() as Document | ShadowRoot).activeElement === element
