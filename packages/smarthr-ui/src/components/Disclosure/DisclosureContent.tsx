'use client'

import { type ComponentProps, type FC, type PropsWithChildren, useState } from 'react'

import { VisuallyHiddenText } from '../VisuallyHiddenText'

import { useDisclosure } from './useDisclosure'

type BaseProps = PropsWithChildren<{
  /** DisclosureTriggerのtargetIdと紐づけるId */
  id: string
  /** 開閉状態。デフォルトは閉じている */
  isOpen?: boolean
  /** 閉じた状態でContentを要素として存在させるか。デフォルトでは要素は存在しない */
  visuallyHidden?: boolean
}>

type DisclosureContentProps = BaseProps & Omit<ComponentProps<'div'>, keyof BaseProps>

export const DisclosureContent: FC<DisclosureContentProps> = ({
  id,
  isOpen,
  visuallyHidden,
  children,
  ...rest
}) => {
  const [expanded, setExpanded] = useDisclosure(id)
  const [prevIsOpen, setPrevIsOpen] = useState(expanded)

  if (isOpen !== undefined && isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen)
    setExpanded(isOpen)
  }

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
