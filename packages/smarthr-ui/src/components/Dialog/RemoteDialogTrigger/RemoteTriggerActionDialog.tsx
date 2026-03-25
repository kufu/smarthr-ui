'use client'

import { UnrecommendedActionDialog } from '../UnrecommendedActionDialog'
import { useRemoteTrigger } from '../useRemoteTrigger'

import type { ComponentProps, FC } from 'react'

type Props = Omit<
  ComponentProps<typeof UnrecommendedActionDialog>,
  'isOpen' | 'onClickClose' | 'id'
> &
  Parameters<typeof useRemoteTrigger>[0]

export const RemoteTriggerActionDialog: FC<Props> = ({
  id,
  onClickClose,
  onToggle,
  onOpen,
  onClose,
  onPressEscape,
  ...rest
}) => {
  const {
    isOpen,
    onClickClose: actualOnClickClose,
    onPressEscape: actualOnPressEscape,
  } = useRemoteTrigger({ id, onClickClose, onPressEscape, onToggle, onOpen, onClose })

  return (
    <UnrecommendedActionDialog
      {...rest}
      id={id}
      isOpen={isOpen}
      onClickClose={actualOnClickClose}
      onPressEscape={actualOnPressEscape}
    />
  )
}
