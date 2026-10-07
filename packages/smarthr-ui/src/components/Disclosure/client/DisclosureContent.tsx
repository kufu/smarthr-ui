'use client'

import { type FC, useEffect, useState } from 'react'

import { VisuallyHiddenText } from '../../VisuallyHiddenText'

import { useDisclosure } from './useDisclosure'

import type { SHRComponentPropsWithRef } from '../../../types'

type Props = SHRComponentPropsWithRef<
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
  const [expanded, setExpanded, addDisclosureChangeListener] = useDisclosure(id)
  const [prevIsOpen, setPrevIsOpen] = useState<boolean | undefined>(undefined)

  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen)

    if (isOpen !== undefined) {
      setExpanded(isOpen)
    }
  }

  useEffect(() => addDisclosureChangeListener(), [addDisclosureChangeListener])

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
