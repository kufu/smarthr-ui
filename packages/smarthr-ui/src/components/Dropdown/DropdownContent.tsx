'use client'

import React, { PropsWithChildren, useContext } from 'react'

import { DropdownContext } from './Dropdown'
import { DropdownContentInner, ElementProps as InnerElementProps } from './DropdownContentInner'

export const DropdownContentContext = React.createContext<{
  onClickCloser: () => void
  controllable: boolean
}>({
  onClickCloser: () => {
    /* noop */
  },
  controllable: false,
})

type Props = PropsWithChildren<{
  /**
   * `true` のとき、ドロップダウン内のコンテンツをクリックしてもドロップダウンが閉じなくなる。。
   *  この場合は、 `DropdownCloser` を用いてドロップダウンを閉じることができる。
   */
  controllable?: boolean
}>

type ElementProps = Omit<InnerElementProps, keyof Props>

export const DropdownContent: React.FC<Props & ElementProps> = ({
  controllable = false,
  ...props
}) => {
  const { DropdownContentRoot, triggerRect, onClickCloser } = useContext(DropdownContext)

  return (
    <DropdownContentRoot>
      <DropdownContentContext.Provider value={{ onClickCloser, controllable }}>
        <DropdownContentInner {...props} triggerRect={triggerRect} controllable={controllable} />
      </DropdownContentContext.Provider>
    </DropdownContentRoot>
  )
}
