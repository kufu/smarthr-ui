import React from 'react'

import { FormDialog } from '../FormDialog'
import { useRemoteTrigger } from '../useRemoteTrigger'

type Props = Omit<React.ComponentProps<typeof FormDialog>, 'isOpen' | 'onClickClose' | 'id'> &
  Parameters<typeof useRemoteTrigger>[0]

export const RemoteTriggerFormDialog: React.FC<Props> = ({ id, onClickClose, ...props }) => {
  const { isOpen, onClickClose: actualOnClickClose } = useRemoteTrigger({ id, onClickClose })

  return <FormDialog {...props} id={id} isOpen={isOpen} onClickClose={actualOnClickClose} />
}
