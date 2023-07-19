import React from 'react'

import { ActionDialog } from '../ActionDialog'
import { useRemoteTrigger } from '../useRemoteTrigger'

type Props = Omit<React.ComponentProps<typeof ActionDialog>, 'isOpen' | 'onClickClose' | 'id'> &
  Parameters<typeof useRemoteTrigger>[0]

export const RemoteTriggerActionDialog: React.FC<Props> = ({
  id,
  onClickClose,
  onToggle,
  onOpen,
  onClose,
  ...props
}) => {
  const {
    isOpen,
    onClickClose: actualOnClickClose,
    onPressEscape,
  } = useRemoteTrigger({ id, onClickClose, onToggle, onOpen, onClose })

  return (
    <ActionDialog
      {...props}
      id={id}
      isOpen={isOpen}
      onClickClose={actualOnClickClose}
      onPressEscape={onPressEscape}
    />
  )
}
