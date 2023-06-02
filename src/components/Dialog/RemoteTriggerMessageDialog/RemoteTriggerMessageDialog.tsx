import React from 'react'

import { MessageDialog } from '../MessageDialog'
import { useRemoteTrigger } from '../useRemoteTrigger'

type Props = Omit<React.ComponentProps<typeof MessageDialog>, 'isOpen' | 'onClickClose' | 'id'> &
  Parameters<typeof useRemoteTrigger>[0]

export const RemoteTriggerMessageDialog: React.FC<Props> = ({ id, onClickClose, ...props }) => {
  const { isOpen, onClickClose: actualOnClickClose } = useRemoteTrigger({ id, onClickClose })

  return <MessageDialog {...props} id={id} isOpen={isOpen} onClickClose={actualOnClickClose} />
}
