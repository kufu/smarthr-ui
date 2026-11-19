'use client'

import { type FC, useEffect, useState } from 'react'

import { VisuallyHiddenText } from '../../VisuallyHiddenText'

import { useDisclosure } from './useDisclosure'

import type { ExtendElementPropsWithRef } from '../../../types'

type Props = ExtendElementPropsWithRef<
  'div',
  {
    /** DisclosureTriggerのtargetIdと紐づけるId */
    id: string
    /** 開閉状態。デフォルトは閉じている */
    isOpen?: boolean
    /** 閉じた状態でContentを要素として存在させるか。デフォルトでは要素は存在しない */
    visuallyHidden?: boolean
  }
>

export const DisclosureContent: FC<Props> = ({ id, isOpen, visuallyHidden, children, ...rest }) => {
  // 初回の isOpen は state の初期値として反映する。
  // animation frame を待つと、StrictMode などでエフェクトが片付けられたときに予約が取り消され、反映されないことがあるため
  const [expanded, setExpanded, addDisclosureChangeListener, notifyDisclosureChange] =
    useDisclosure(id, isOpen ?? false)
  const [initialIsOpen] = useState(isOpen)
  const [prevIsOpen, setPrevIsOpen] = useState<boolean | undefined>(isOpen)

  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen)

    if (isOpen !== undefined) {
      setExpanded(isOpen)
    }
  }

  useEffect(() => {
    const removeDisclosureChangeListener = addDisclosureChangeListener()

    // 初期値で開いている場合、DisclosureTrigger 側の開閉状態（aria-expanded）にも同期する
    if (initialIsOpen) {
      notifyDisclosureChange()
    }

    return removeDisclosureChangeListener
  }, [addDisclosureChangeListener, notifyDisclosureChange, initialIsOpen])

  if (expanded) {
    return (
      <div {...rest} id={id}>
        {children}
      </div>
    )
  }

  if (visuallyHidden) {
    return (
      <VisuallyHiddenText {...rest} as="div" id={id}>
        {children}
      </VisuallyHiddenText>
    )
  }

  return null
}
