'use client'

import { ControlledStepFormDialog } from '../ControlledStepFormDialog'

import { useRemoteTrigger } from './useRemoteTrigger'

import type { ComponentPropsWithRef, FC } from 'react'

type BaseProps = Parameters<typeof useRemoteTrigger>[0]
type Props = BaseProps &
  Omit<
    ComponentPropsWithRef<typeof ControlledStepFormDialog>,
    keyof BaseProps | 'isOpen' | 'onClickClose' | 'id'
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
