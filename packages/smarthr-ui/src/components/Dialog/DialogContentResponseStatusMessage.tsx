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
    <ResponseMessage icon={responseStatus.status}>{responseStatus.message}</ResponseMessage>
  )

  return (
    /**
     * ライブリージョンを条件付きでDOMに追加すると、支援技術に通知が正しく行われないことがあるため、常にDOM上に存在するようにしています
     *
     * @see https://www.sarasoueidan.com/blog/accessible-notifications-with-aria-live-regions-part-2/#make-sure-the-live-region-container-is-in-the-dom-as-early-as-possible
     */
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
