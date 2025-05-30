import { type FC, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { ResponseMessage } from '../ResponseMessage'

import type { useResponseStatus } from '../../hooks/useResponseStatus'

const classNameGenerator = tv({
  base: 'empty:!shr-mt-0',
})

export const DialogContentResponseStatusMessage: FC<{
  responseStatus: ReturnType<typeof useResponseStatus>
  className?: string
}> = ({ responseStatus, className }) => {
  const classNames = useMemo(() => classNameGenerator({ className }), [className])

  const StatusMessage = () => (
    <ResponseMessage type={responseStatus.status}>{responseStatus.message}</ResponseMessage>
  )

  return (
    <>
      <div className={classNames} role="alert">
        {responseStatus.message && responseStatus.status === 'error' && <StatusMessage />}
      </div>
      <div className={classNames} role="status">
        {responseStatus.message && responseStatus.status === 'success' && <StatusMessage />}
      </div>
    </>
  )
}
