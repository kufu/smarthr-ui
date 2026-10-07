'use client'

import { ControlledMessageDialog } from '../ControlledMessageDialog'

import { useRemoteTrigger } from './useRemoteTrigger'

import type { SHRComponentPropsWithRef } from '../../../types'
import type { FC } from 'react'

type Props = SHRComponentPropsWithRef<
  typeof ControlledMessageDialog,
  Omit<Parameters<typeof useRemoteTrigger>[0], 'onPressEscape'>,
  { omit: 'isOpen' }
>

export const MessageDialog: FC<Props> = ({
  id,
  onClickClose,
  onToggle,
  onOpen,
  onClose,
  ...rest
}) => {
  const { isOpen, handleClickClose } = useRemoteTrigger({
    id,
    onClickClose,
    onToggle,
    onOpen,
    onClose,
  })

  return (
    <ControlledMessageDialog {...rest} id={id} isOpen={isOpen} onClickClose={handleClickClose} />
  )
}
