import { ResponseMessage } from '../ResponseMessage'

import type { useResponseStatus } from '../../hooks/useResponseStatus'
import type { FC } from 'react'

export const DialogContentResponseStatusMessage: FC<{
  responseStatus: ReturnType<typeof useResponseStatus>
  className?: string
}> = ({ responseStatus, className }) => (
  <div className={className} role={responseStatus.status === 'error' ? 'alert' : 'status'}>
    {responseStatus.message && responseStatus.status && (
      <ResponseMessage type={responseStatus.status}>{responseStatus.message}</ResponseMessage>
    )}
  </div>
)
