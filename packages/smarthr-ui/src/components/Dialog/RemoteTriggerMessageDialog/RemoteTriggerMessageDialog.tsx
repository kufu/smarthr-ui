'use client'

import { MessageDialog } from '../MessageDialog'
import { useRemoteTrigger } from '../useRemoteTrigger'

import type { ComponentProps, FC } from 'react'

type Props = Omit<ComponentProps<typeof MessageDialog>, 'isOpen' | 'onClickClose' | 'id'> &
  Parameters<typeof useRemoteTrigger>[0]

export const RemoteTriggerMessageDialog: FC<Props> = ({
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
