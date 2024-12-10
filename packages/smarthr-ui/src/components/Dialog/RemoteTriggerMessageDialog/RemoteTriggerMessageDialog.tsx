'use client'

import React from 'react'

import { MessageDialog } from '../MessageDialog'
import { useRemoteTrigger } from '../useRemoteTrigger'

type Props = Omit<React.ComponentProps<typeof MessageDialog>, 'isOpen' | 'onClickClose' | 'id'> &
  Parameters<typeof useRemoteTrigger>[0]

export const RemoteTriggerMessageDialog: React.FC<Props> = ({
  id,
  onClickClose,
  onToggle,
  onOpen,
  onClose,
  ...props
}) => {
  const { isOpen, onClickClose: actualOnClickClose } = useRemoteTrigger({
    id,
    onClickClose,
    onToggle,
    onOpen,
    onClose,
  })

  return <MessageDialog {...props} id={id} isOpen={isOpen} onClickClose={actualOnClickClose} />
}
