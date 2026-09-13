'use client'

import { type FC, type PropsWithChildren, useContext } from 'react'

import { DropdownContext } from './Dropdown'
import {
  DropdownContentInner,
  type ElementProps as InnerElementProps,
} from './DropdownContentInner'

type BaseProps = PropsWithChildren<{
  /**
   * `true` のとき、ドロップダウン内のコンテンツをクリックしてもドロップダウンが閉じなくなる。。
   *  この場合は、 `DropdownCloser` を用いてドロップダウンを閉じることができる。
   */
  controllable?: boolean
}>

type Props = BaseProps & Omit<InnerElementProps, keyof BaseProps>

export const DropdownContent: FC<Props> = ({ controllable = false, ...rest }) => {
  const { DropdownContentRoot, triggerRect } = useContext(DropdownContext)

  return (
    <DropdownContentRoot>
      <DropdownContentInner {...rest} triggerRect={triggerRect} controllable={controllable} />
    </DropdownContentRoot>
  )
}
