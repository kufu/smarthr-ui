'use client'

import { type ComponentProps, type FC, useCallback, useState } from 'react'

import { Panel } from '../../Panel'

type Props = Omit<ComponentProps<typeof Panel>, 'ref'>

// HINT: overflowがvisible・clip以外の要素はスクロールコンテナになり、stickyの基準になる
const SCROLL_CONTAINER_OVERFLOW_REGEX = /auto|scroll|hidden|overlay/

const checkStickyToViewport = (node: HTMLElement) => {
  const { body, documentElement } = document

  // HINT: body・htmlのoverflowはviewportに伝播するため、到達した時点でviewportが基準とみなす
  for (
    let el = node.parentElement;
    el && el !== body && el !== documentElement;
    el = el.parentElement
  ) {
    const { overflowX, overflowY } = getComputedStyle(el)

    if (SCROLL_CONTAINER_OVERFLOW_REGEX.test(`${overflowX} ${overflowY}`)) {
      return false
    }
  }

  return true
}

export const FloatAreaPanel: FC<Props> = (props) => {
  // HINT: 多くの場合viewportが基準になるため、初期値はtrueとする
  const [stickyToViewport, setStickyToViewport] = useState(true)

  // HINT: cleanup functionをreturnしていないためuseCallbackRefCleanupForReact18は不要。
  // React v18の対応を切ったらこのコメントも削除する
  const callbackRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      setStickyToViewport(checkStickyToViewport(node))
    }
  }, [])

  return (
    <Panel {...props} ref={callbackRef} data-sticky-to-viewport={stickyToViewport || undefined} />
  )
}
