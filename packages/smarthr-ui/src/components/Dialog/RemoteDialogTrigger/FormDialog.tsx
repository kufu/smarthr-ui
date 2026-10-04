'use client'

import { ControlledFormDialog } from '../ControlledFormDialog'

import { useRemoteTrigger } from './useRemoteTrigger'

import type { ComponentPropsWithRef, FC } from 'react'

type BaseProps = Parameters<typeof useRemoteTrigger>[0]
type Props = BaseProps &
  Omit<
    ComponentPropsWithRef<typeof ControlledFormDialog>,
    keyof BaseProps | 'isOpen' | 'onClickClose' | 'id'
  >

export const FormDialog: FC<Props> = ({
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
    <ControlledFormDialog
      {...rest}
      id={id}
      isOpen={isOpen}
      onClickClose={handleClickClose}
      onPressEscape={handlePressEscape}
    />
  )
}
