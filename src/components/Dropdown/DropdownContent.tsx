import React, { PropsWithChildren, useContext } from 'react'

import { DropdownContext } from './Dropdown'
import { DropdownContentInner, ElementProps as InnerElementProps } from './DropdownContentInner'

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

type Props = PropsWithChildren<{
  /**
   * `true` のとき、ドロップダウン内のコンテンツをクリックしてもドロップダウンが閉じなくなる。。
   *  この場合は、 `DropdownCloser` を用いてドロップダウンを閉じることができる。
   */
  controllable?: boolean
  /** `true` のとき、ウィンドウサイズに応じてドロップダウン内が自動的にスクロール可能になる */
  scrollable?: boolean
}>

type ElementProps = Omit<InnerElementProps, keyof Props>

export const DropdownContent: React.FC<Props & ElementProps> = ({
  controllable = false,
  scrollable = true,
  ...props
}) => {
  const { DropdownContentRoot, triggerRect, onClickCloser } = useContext(DropdownContext)

  return (
    <DropdownContentRoot>
      <DropdownContentContext.Provider value={{ onClickCloser, controllable, scrollable }}>
        <DropdownContentInner
          {...props}
          triggerRect={triggerRect}
          scrollable={scrollable}
          controllable={controllable}
        />
      </DropdownContentContext.Provider>
    </DropdownContentRoot>
  )
}
