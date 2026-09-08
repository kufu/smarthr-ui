'use client'

import { Panel } from '../../Panel'

import type { ComponentType, FC, ReactNode } from 'react'

type Props = {
  as?: string | ComponentType<any>
  children: ReactNode
  className: string
}

export const ClickablePanel: FC<Props> = ({ as, className, children }) => (
  <Panel as={as} padding={1} className={className} onClick={handleDelegateClick}>
    {children}
  </Panel>
)

/** RadioButtonのクリック可能な要素（labelまたはinput）を判定するための正規表現 */
const REGEX_RADIO_CLICKABLE_ELEMENT = /^(label|input)$/

/**
 * イベントパス内にRadioButtonの要素（LABELまたはINPUT）が含まれているか判定
 *
 * NOTE: ReactのSyntheticEventは非同期処理内でnullになる可能性があるため、
 * イベントオブジェクトではなく、事前に取得したpathとcurrentTargetを受け取る
 *
 * @param path イベントのcomposedPath（事前に取得したもの）
 * @param currentTarget イベントのcurrentTarget（事前に取得したもの）
 * @returns RadioButtonの要素がクリックされた場合true
 */
const isRadioButtonElementClicked = (path: EventTarget[], currentTarget: EventTarget): boolean => {
  for (const node of path) {
    // 先にLABELまたはINPUTをチェック（高頻度ケース）
    if (
      node instanceof HTMLElement &&
      REGEX_RADIO_CLICKABLE_ELEMENT.test(node.tagName.toLowerCase())
    ) {
      return true
    } else if (node === currentTarget) {
      // Base要素に到達したらfalse（低頻度ケース）
      return false
    }
  }

  return false
}

// 外側の装飾を押しても内側のラジオボタンが押せるようにする
const handleDelegateClick = (e: React.MouseEvent<HTMLDivElement>) => {
  // RadioButtonの要素（labelまたはinput）以外がクリックされた場合（description や Base の余白）
  if (!isRadioButtonElementClicked(e.nativeEvent.composedPath(), e.currentTarget)) {
    // Base要素のclickイベントは止める（実装の詳細を隠蔽し、input要素のclickのみを親に伝える）
    e.stopPropagation()
    // 手動でinputをクリック
    e.currentTarget
      .querySelector<HTMLInputElement>('[data-smarthr-ui-input="true"][type="radio"]')
      ?.click()
  }
  // RadioButtonの要素（labelまたはinput）がクリックされた場合は何もしない
  // （ブラウザの標準動作でinputがクリックされ、そのイベントが親に伝わる）
}
