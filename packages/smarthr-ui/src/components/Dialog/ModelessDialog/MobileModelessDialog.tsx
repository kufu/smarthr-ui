'use client'

import { type ComponentProps, type FC, type MouseEvent, useMemo } from 'react'

import { useLatest } from '../../../hooks/useLatest'
import { ControlledMessageDialog } from '../ControlledMessageDialog'

import type { ModelessDialog } from './ModelessDialog'

const NOOP = () => undefined

type Props = ComponentProps<typeof ModelessDialog>

export const MobileModelessDialog: FC<Props> = ({
  children,
  onClickClose,
  onPressEscape,

  // モバイル表示では使用できない ModelessDialog 固有の props
  footer: _footer,
  height: _height,
  top: _top,
  left: _left,
  right: _right,
  bottom: _bottom,
  resizable: _resizable,

  ...rest
}) => {
  const latest = useLatest({ onClickClose })
  const functions = useMemo(
    () => ({
      handleClickClose: (e?: MouseEvent<HTMLButtonElement>) => {
        if (e) {
          latest.onClickClose?.(e)
        }
      },
    }),
    [latest],
  )

  return (
    <ControlledMessageDialog
      {...rest}
      onClickClose={functions.handleClickClose}
      onPressEscape={onPressEscape ?? NOOP}
    >
      {children}
    </ControlledMessageDialog>
  )
}
