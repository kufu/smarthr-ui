'use client'

import { ControlledMessageDialog } from '../ControlledMessageDialog'

import { useRemoteTrigger } from './useRemoteTrigger'

import type { ComponentPropsWithRef, FC } from 'react'

type BaseProps = Omit<Parameters<typeof useRemoteTrigger>[0], 'onPressEscape'>
type Props = BaseProps &
  Omit<
    ComponentPropsWithRef<typeof ControlledMessageDialog>,
    keyof BaseProps | 'isOpen' | 'onClickClose' | 'id'
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
