'use client'

import { type FC, type ReactNode, useContext, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { Tooltip } from '../../Tooltip'

import { DropdownContext } from './Dropdown'

import type { SHRComponentPropsWithoutRef } from '../../../types'

type Props = SHRComponentPropsWithoutRef<
  'div',
  {
    tooltip?: { message: ReactNode; show?: boolean }
  },
  { omit: 'onClickCapture' }
>

const classNameGenerator = tv({
  base: 'smarthr-ui-Dropdown shr-inline-block',
})

export const DropdownTrigger: FC<Props> = ({ children, className, tooltip, ...rest }) => {
  const { handleDelegateClickTrigger, triggerLayoutEffectRef } = useContext(DropdownContext)
  const actualClassName = useMemo(() => classNameGenerator({ className }), [className])

  return (
    // HINT: Trigger要素自体にonClickが設定されている場合、先にDropdownを開いた状態で処理を行いたい
    // そのためcaptureで開く処理を実行する
    <div
      {...rest}
      ref={triggerLayoutEffectRef}
      className={actualClassName}
      onClickCapture={handleDelegateClickTrigger}
    >
      {tooltip && tooltip.show && tooltip.message ? (
        // eslint-disable-next-line smarthr/a11y-scroller-has-tabindex
        <Tooltip tabIndex={-1} triggerType="icon" message={tooltip.message}>
          {children}
        </Tooltip>
      ) : (
        children
      )}
    </div>
  )
}
