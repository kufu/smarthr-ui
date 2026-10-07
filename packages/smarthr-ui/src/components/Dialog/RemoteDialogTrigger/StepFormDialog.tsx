'use client'

import { ControlledStepFormDialog } from '../ControlledStepFormDialog'

import { useRemoteTrigger } from './useRemoteTrigger'

import type { SHRComponentPropsWithRef } from '../../../types'
import type { FC } from 'react'

type Props = SHRComponentPropsWithRef<
  typeof ControlledStepFormDialog,
  Parameters<typeof useRemoteTrigger>[0],
  { omit: 'isOpen' | 'onClickClose' | 'id' }
>

export const StepFormDialog: FC<Props> = ({
  id,
  onClickClose,
  onToggle,
  onOpen,
  onClose,
  onPressEscape,
  ...rest
}) => {
  const { isOpen, handleClickClose, handlePressEscape } = useRemoteTrigger({
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
      onClickClose={handleClickClose}
      onPressEscape={handlePressEscape}
    />
  )
}
