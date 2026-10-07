'use client'

import { ControlledFormDialog } from '../ControlledFormDialog'

import { useRemoteTrigger } from './useRemoteTrigger'

import type { SHRComponentPropsWithRef } from '../../../types'
import type { FC } from 'react'

type Props = SHRComponentPropsWithRef<
  typeof ControlledFormDialog,
  Parameters<typeof useRemoteTrigger>[0],
  { omit: 'isOpen' }
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
