'use client'

import { UnrecommendedMessageDialog } from '../UnrecommendedMessageDialog'
import { useRemoteTrigger } from '../useRemoteTrigger'

import type { ComponentProps, FC } from 'react'

type Props = Omit<
  ComponentProps<typeof UnrecommendedMessageDialog>,
  'isOpen' | 'onClickClose' | 'id'
> &
  Parameters<typeof useRemoteTrigger>[0]

export const MessageDialog: FC<Props> = ({
  id,
  onClickClose,
  onToggle,
  onOpen,
  onClose,
  ...rest
}) => {
  const { isOpen, onClickClose: actualOnClickClose } = useRemoteTrigger({
    id,
    onClickClose,
    onToggle,
    onOpen,
    onClose,
  })

  return (
    <UnrecommendedMessageDialog
      {...rest}
      id={id}
      isOpen={isOpen}
      onClickClose={actualOnClickClose}
    />
  )
}
