import { ResponseMessage } from '../ResponseMessage'

import type { useResponseStatus } from '../../hooks/useResponseStatus'
import type { FC } from 'react'

export const DialogContentResponseStatusMessage: FC<{
  responseStatus: ReturnType<typeof useResponseStatus>
  className?: string
  actionButtonId?: string
}> = ({ responseStatus, className, actionButtonId }) => {
  const isError = responseStatus.message && responseStatus.status === 'error'
  const isSuccess = responseStatus.message && responseStatus.status === 'success'

  return (
    /**
     * ライブリージョンを条件付きでDOMに追加すると、支援技術に通知が正しく行われないことがあるため、常にDOM上に存在するようにしています
     *
     * @see https://www.sarasoueidan.com/blog/accessible-notifications-with-aria-live-regions-part-2/#make-sure-the-live-region-container-is-in-the-dom-as-early-as-possible
     */
    <>
      {/* output要素はaria-live="polite"相当のため、即座に読み上げが必要なエラーにはrole="alert"のdivを使用する */}
      <div className={isError ? `${className} shr-mt-0.5` : className} role="alert">
        {isError && <ResponseMessage status="error">{responseStatus.message}</ResponseMessage>}
      </div>
      {/* APIレスポンスの成功結果を表示するoutput要素。output要素はaria-live="polite"相当のrole="status"を暗黙的に持つ */}
      <output
        className={isSuccess ? `${className} shr-mt-0.5` : className}
        htmlFor={actionButtonId}
      >
        {isSuccess && <ResponseMessage status="success">{responseStatus.message}</ResponseMessage>}
      </output>
    </>
  )
}
