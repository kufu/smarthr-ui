'use client'

import { type FC, type PropsWithChildren, createContext, useContext } from 'react'

import { DropdownContext } from './Dropdown'
import {
  DropdownContentInner,
  type ElementProps as InnerElementProps,
} from './DropdownContentInner'

export const DropdownContentContext = createContext<{
  handleDelegateClickCloser: () => void
  controllable: boolean
}>({
  handleDelegateClickCloser: () => {
    /* noop */
  },
  controllable: false,
})

type BaseProps = PropsWithChildren<{
  /**
   * `true` のとき、ドロップダウン内のコンテンツをクリックしてもドロップダウンが閉じなくなる。。
   *  この場合は、 `DropdownCloser` を用いてドロップダウンを閉じることができる。
   */
  controllable?: boolean
}>

type Props = BaseProps & Omit<InnerElementProps, keyof BaseProps>

export const DropdownContent: FC<Props> = ({ controllable = false, ...rest }) => {
  const { DropdownContentRoot, triggerRect, handleDelegateClickCloser } =
    useContext(DropdownContext)

  return (
    <DropdownContentRoot>
      <DropdownContentContext.Provider value={{ handleDelegateClickCloser, controllable }}>
        <DropdownContentInner {...rest} triggerRect={triggerRect} controllable={controllable} />
      </DropdownContentContext.Provider>
    </DropdownContentRoot>
  )
}
