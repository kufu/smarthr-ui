'use client'

import { StepFormDialog } from '../StepFormDialog'
import { useRemoteTrigger } from '../useRemoteTrigger'

import type { ComponentProps, FC } from 'react'

type Props = Omit<ComponentProps<typeof StepFormDialog>, 'isOpen' | 'onClickClose' | 'id'> &
  Parameters<typeof useRemoteTrigger>[0]

export const RemoteTriggerStepFormDialog: FC<Props> = ({
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
  } = useRemoteTrigger({
    id,
    onClickClose,
    onPressEscape,
    onToggle,
    onOpen,
    onClose,
  })

  return (
    <StepFormDialog
      {...rest}
      id={id}
      isOpen={isOpen}
      onClickClose={actualOnClickClose}
      onPressEscape={actualOnPressEscape}
    />
  )
}
