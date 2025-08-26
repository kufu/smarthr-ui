'use client'

import { type ComponentProps, type FC, type PropsWithChildren, useEffect } from 'react'

import { VisuallyHiddenText } from '../VisuallyHiddenText'

import { useDisclosure } from './useDisclosure'

type DisclosureContentAbstractProps = PropsWithChildren<{
  /** DisclosureTriggerのtargetIdと紐づけるId */
  id: string
  /** 開閉状態。デフォルトは閉じている */
  isOpen?: boolean
  /** 閉じた状態でContentを要素として存在させるか。デフォルトでは要素は存在しない */
  visuallyHidden?: boolean
}>

type DisclosureContentProps = DisclosureContentAbstractProps &
  Omit<ComponentProps<'div'>, keyof DisclosureContentAbstractProps>

export const DisclosureContent: FC<DisclosureContentProps> = ({
  id,
  isOpen,
  visuallyHidden,
  children,
  ...rest
}) => {
  const [expanded, setExpanded] = useDisclosure(id)

  useEffect(() => {
    if (isOpen !== undefined) {
      setExpanded(isOpen)
    }
  }, [isOpen, setExpanded])

  if (expanded) {
    return (
      <div {...rest} id={id}>
        {children}
      </div>
    )
  }

  if (visuallyHidden) {
    return (
      <VisuallyHiddenText {...rest} id={id} as="div">
        {children}
      </VisuallyHiddenText>
    )
  }

  return null
}
