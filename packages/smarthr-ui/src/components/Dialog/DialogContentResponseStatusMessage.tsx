import { ResponseMessage } from '../ResponseMessage'

import type { useResponseStatus } from '../../hooks/useResponseStatus'
import type { FC } from 'react'

export const DialogContentResponseStatusMessage: FC<{
  responseStatus: ReturnType<typeof useResponseStatus>
  className?: string
}> = ({ responseStatus, className }) => {
  const isError = responseStatus.message && responseStatus.status === 'error'
  const isSuccess = responseStatus.message && responseStatus.status === 'success'

  return (
    /**
     * ライブリージョンを条件付きでDOMに追加すると、支援技術に通知が正しく行われないことがあるため、常にDOM上に存在するようにしています
     *
     * @see https://www.sarasoueidan.com/blog/accessible-notifications-with-aria-live-regions-part-2/#make-sure-the-live-region-container-is-in-the-dom-as-early-as-possible
     */
    <>
      <div className={isError ? `${className} shr-mt-0.5` : className} role="alert">
        {isError && <ResponseMessage status="error">{responseStatus.message}</ResponseMessage>}
      </div>
      <div className={isSuccess ? `${className} shr-mt-0.5` : className} role="status">
        {isSuccess && <ResponseMessage status="success">{responseStatus.message}</ResponseMessage>}
      </div>
    </>
  )
}
