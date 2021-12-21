import React, { useContext } from 'react'

import { DropdownContext } from './Dropdown'
import { DropdownContentInner } from './DropdownContentInner'
import { useClassNames } from './useClassNames'

export const DropdownContentContext = React.createContext<{
  onClickCloser: () => void
  controllable: boolean
  scrollable: boolean
}>({
  onClickCloser: () => {
    /* noop */
  },
  controllable: false,
  scrollable: true,
})

type Props = {
  /**
   * `true` のとき、ドロップダウン内のコンテンツをクリックしてもドロップダウンが閉じなくなる。。
   *  この場合は、 `DropdownCloser` を用いてドロップダウンを閉じることができる。
   */
  controllable?: boolean
  /** `true` のとき、ウィンドウサイズに応じてドロップダウン内が自動的にスクロール可能になる */
  scrollable?: boolean
  /** コンポーネントに適用するクラス名 */
  className?: string
  children?: React.ReactNode
}

export const DropdownContent: React.VFC<Props> = ({
  controllable = false,
  scrollable = true,
  className = '',
  children,
}) => {
  const { DropdownContentRoot, triggerRect, onClickCloser } = useContext(DropdownContext)
  const classNames = useClassNames()

  return (
    <DropdownContentRoot>
      <DropdownContentContext.Provider value={{ onClickCloser, controllable, scrollable }}>
        <DropdownContentInner
          triggerRect={triggerRect}
          scrollable={scrollable}
          className={`${className} ${classNames.content}`}
          controllable={controllable}
        >
          {children}
        </DropdownContentInner>
      </DropdownContentContext.Provider>
    </DropdownContentRoot>
  )
}
