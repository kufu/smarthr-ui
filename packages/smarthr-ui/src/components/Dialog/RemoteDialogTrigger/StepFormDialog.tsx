'use client'

import { ControlledStepFormDialog } from '../ControlledStepFormDialog'
import { useRemoteTrigger } from '../useRemoteTrigger'

import type { ComponentProps, FC } from 'react'

type Props = Omit<
  ComponentProps<typeof ControlledStepFormDialog>,
  'isOpen' | 'onClickClose' | 'id'
> &
  Parameters<typeof useRemoteTrigger>[0]

export const StepFormDialog: FC<Props> = ({
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
    <ControlledStepFormDialog
      {...rest}
      id={id}
      isOpen={isOpen}
      onClickClose={actualOnClickClose}
      onPressEscape={actualOnPressEscape}
    />
  )
}
