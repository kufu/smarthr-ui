import { ControlledMessageDialog } from '../ControlledMessageDialog'

import type { ModelessDialog } from './ModelessDialog'
import type { ComponentProps, FC } from 'react'

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
}) => (
  <ControlledMessageDialog
    {...rest}
    onClickClose={onClickClose ?? NOOP}
    onPressEscape={onPressEscape ?? NOOP}
  >
    {children}
  </ControlledMessageDialog>
)
