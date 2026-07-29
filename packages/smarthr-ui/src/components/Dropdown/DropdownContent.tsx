'use client'

import { type FC, type PropsWithChildren, createContext, useContext } from 'react'

import { DropdownContext } from './Dropdown'
import {
  DropdownContentInner,
  type ElementProps as InnerElementProps,
} from './DropdownContentInner'

export const DropdownContentContext = createContext<{
  handleClickCloser: () => void
  controllable: boolean
}>({
  handleClickCloser: () => {
    /* noop */
  },
  controllable: false,
})

type AbstractProps = PropsWithChildren<{
  /**
   * `true` のとき、ドロップダウン内のコンテンツをクリックしてもドロップダウンが閉じなくなる。。
   *  この場合は、 `DropdownCloser` を用いてドロップダウンを閉じることができる。
   */
  controllable?: boolean
}>

type Props = AbstractProps & Omit<InnerElementProps, keyof AbstractProps>

export const DropdownContent: FC<Props> = ({ controllable = false, ...rest }) => {
  const { DropdownContentRoot, triggerRect, handleClickCloser } = useContext(DropdownContext)

  return (
    <DropdownContentRoot>
      <DropdownContentContext.Provider value={{ handleClickCloser, controllable }}>
        <DropdownContentInner {...rest} triggerRect={triggerRect} controllable={controllable} />
      </DropdownContentContext.Provider>
    </DropdownContentRoot>
  )
}
