'use client'

import { ControlledActionDialog } from '../ControlledActionDialog'
import { useRemoteTrigger } from '../useRemoteTrigger'

import type { ComponentProps, FC } from 'react'

type Props = Omit<ComponentProps<typeof ControlledActionDialog>, 'isOpen' | 'onClickClose' | 'id'> &
  Parameters<typeof useRemoteTrigger>[0]

export const ActionDialog: FC<Props> = ({
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
    <ControlledActionDialog
      {...rest}
      id={id}
      isOpen={isOpen}
      onClickClose={actualOnClickClose}
      onPressEscape={actualOnPressEscape}
    />
  )
}
