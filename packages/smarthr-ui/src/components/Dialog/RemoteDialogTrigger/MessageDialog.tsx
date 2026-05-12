'use client'

import { ControlledMessageDialog } from '../ControlledMessageDialog'
import { useRemoteTrigger } from '../useRemoteTrigger'

import type { ComponentProps, FC } from 'react'

type Props = Omit<
  ComponentProps<typeof ControlledMessageDialog>,
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
    <ControlledMessageDialog {...rest} id={id} isOpen={isOpen} onClickClose={actualOnClickClose} />
  )
}
