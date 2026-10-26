import { ResponseMessage } from '../ResponseMessage'

import type { useResponseStatus } from '../../hooks/useResponseStatus'
import type { FC } from 'react'

export const DialogContentResponseStatusMessage: FC<{
  responseStatus: ReturnType<typeof useResponseStatus>
  className?: string
}> = ({ responseStatus, className }) => {
  if (responseStatus.message) {
    let attrs: { role: 'status' | 'alert'; status: 'success' | 'error' } | null = null

    switch (responseStatus.status) {
      case 'error':
        attrs = { role: 'alert', status: 'error' }
        break
      case 'success':
        attrs = { role: 'status', status: 'success' }
        break
    }

    if (attrs) {
      return (
        <ResponseMessage {...attrs} className={`${className} shr-mt-0.5`}>
          {responseStatus.message}
        </ResponseMessage>
      )
    }
  }

  return null
}
