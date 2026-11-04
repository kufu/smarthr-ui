'use client'

import { Panel } from '../../Panel'

import type { ComponentProps, FC } from 'react'

type Props = Omit<ComponentProps<typeof Panel>, 'ref'>

// HINT: overflowがvisible・clip以外の要素はスクロールコンテナになり、stickyの基準になる。
// 祖先を辿って算出値を調べるのは重いため、smarthr-uiのクラスで指定されたものに限定して判定する
const SCROLL_CONTAINER_SELECTOR = [
  '.shr-overflow-auto',
  '.shr-overflow-scroll',
  '.shr-overflow-hidden',
  '.shr-overflow-x-auto',
  '.shr-overflow-x-scroll',
  '.shr-overflow-x-hidden',
  '.shr-overflow-y-auto',
  '.shr-overflow-y-scroll',
  '.shr-overflow-y-hidden',
].join(',')

// HINT: styleの調整のためだけの属性のため、再レンダリングせず直接切り替える
const callbackRef = (node: HTMLDivElement | null) => {
  if (!node) {
    return
  }

  const scrollContainer = node.parentElement?.closest(SCROLL_CONTAINER_SELECTOR)

  node.toggleAttribute(
    'data-sticky-to-viewport',
    // HINT: body・htmlのoverflowはviewportに伝播するため、viewportが基準とみなす
    !scrollContainer ||
      scrollContainer === document.body ||
      scrollContainer === document.documentElement,
  )
}

export const FloatAreaPanel: FC<Props> = (props) => (
  // HINT: 多くの場合viewportが基準になるため、初期状態では属性を付与しておく
  <Panel {...props} ref={callbackRef} data-sticky-to-viewport />
)
