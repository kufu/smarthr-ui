'use client'

import { type FC, type MouseEvent, useCallback, useContext } from 'react'

import { findDelegateTarget } from '../../../libs/delegate'

import { DrawerContext } from './DrawerContext'

import type { ExtendElementPropsWithoutRef } from '../../../types'

type Props = ExtendElementPropsWithoutRef<'span', object, { omit: 'className' | 'onClick' }>

// onClick(close) を持たせないのは、閉じる前の確認を Drawer の onClickClose の1か所に集めるため
export const DrawerCloser: FC<Props> = (props) => {
  const { handleClickClose } = useContext(DrawerContext)

  const handleDelegateClick = useCallback(
    (e: MouseEvent<HTMLSpanElement>) => {
      const button = findDelegateTarget<HTMLButtonElement>(e, 'button')

      if (button && !button.disabled && button.getAttribute('aria-disabled') !== 'true') {
        handleClickClose()
      }
    },
    [handleClickClose],
  )

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
    <span
      {...props}
      className="smarthr-ui-Drawer-closer shr-contents"
      onClick={handleDelegateClick}
    />
  )
}
