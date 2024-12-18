import React, {
  type FC,
  type FormEvent,
  type PropsWithChildren,
  type ReactNode,
  useCallback,
} from 'react'
import { tv } from 'tailwind-variants'

import { Button } from '../../Button'
import { Cluster, Stack } from '../../Layout'
import { ResponseMessage } from '../../ResponseMessage'
import { Section } from '../../SectioningContent'
import { DialogBody, Props as DialogBodyProps } from '../DialogBody'
import { DialogHeader, type Props as DialogHeaderProps } from '../DialogHeader'
import { dialogContentInner } from '../dialogInnerStyle'

import type { DecoratorsType, ResponseMessageType } from '../../../types'

export type BaseProps = PropsWithChildren<
  DialogHeaderProps &
    DialogBodyProps & {
      /** アクションボタンのラベル */
      actionText: ReactNode
      /** アクションボタンのスタイル */
      actionTheme?: 'primary' | 'secondary' | 'danger'
      /**
       * アクションボタンをクリックした時に発火するコールバック関数
       * @param closeDialog ダイアログを閉じる関数
       */
      onSubmit: (closeDialog: () => void, e: FormEvent<HTMLFormElement>) => void
      /** アクションボタンを無効にするかどうか */
      actionDisabled?: boolean
      /** 閉じるボタンを無効にするかどうか */
      closeDisabled?: boolean
      /** ダイアログフッターの左端操作領域 */
      subActionArea?: ReactNode
      /** コンポーネント内の文言を変更するための関数を設定 */
      decorators?: DecoratorsType<'closeButtonLabel'>
    }
>

export type FormDialogContentInnerProps = BaseProps & {
  onClickClose: () => void
  responseMessage?: ResponseMessageType
}

const CLOSE_BUTTON_LABEL = 'キャンセル'

const formDialogContentInner = tv({
  extend: dialogContentInner,
  slots: {
    // 領域を狭くしたときにwrapperも縮むようにflexを使用
    wrapper: 'shr-flex shr-flex-col',
    // 領域を狭くしたときにwrapperも縮むようにflexを使用
    form: 'shr-overflow-y-auto shr-flex-auto shr-flex shr-flex-col',
    contentWrapper: 'shr-overflow-y-auto shr-flex-auto',
  },
})

export const FormDialogContentInner: FC<FormDialogContentInnerProps> = ({
  children,
  title,
  titleId,
  subtitle,
  titleTag,
  contentBgColor,
  contentPadding,
  actionText,
  actionTheme = 'primary',
  onSubmit,
  onClickClose,
  responseMessage,
  actionDisabled = false,
  closeDisabled,
  subActionArea,
  decorators,
}) => {
  const handleSubmitAction = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      // HINT: React Portals などで擬似的にformがネストしている場合など、stopPropagationを実行しないと
      // 親formが意図せずsubmitされてしまう場合がある
      e.stopPropagation()
      onSubmit(onClickClose, e)
    },
    [onSubmit, onClickClose],
  )
  const isRequestProcessing = responseMessage && responseMessage.status === 'processing'

  const { form, contentWrapper, wrapper, actionArea, buttonArea, message } =
    formDialogContentInner()

  return (
    // eslint-disable-next-line smarthr/a11y-heading-in-sectioning-content, smarthr/a11y-prohibit-sectioning-content-in-form
    <Section className={wrapper()}>
      <DialogHeader title={title} subtitle={subtitle} titleTag={titleTag} titleId={titleId} />
      <form onSubmit={handleSubmitAction} className={form()}>
        <div className={contentWrapper()}>
          <DialogBody contentPadding={contentPadding} contentBgColor={contentBgColor}>
            {children}
          </DialogBody>
        </div>
        <Stack gap={0.5} className={actionArea()}>
          <Cluster justify="space-between">
            {subActionArea}
            <Cluster gap={{ row: 0.5, column: 1 }} className={buttonArea()}>
              <Button
                onClick={onClickClose}
                disabled={closeDisabled || isRequestProcessing}
                className="smarthr-ui-Dialog-closeButton"
              >
                {decorators?.closeButtonLabel?.(CLOSE_BUTTON_LABEL) || CLOSE_BUTTON_LABEL}
              </Button>
              <Button
                type="submit"
                variant={actionTheme}
                disabled={actionDisabled}
                loading={isRequestProcessing}
                className="smarthr-ui-Dialog-actionButton"
              >
                {actionText}
              </Button>
            </Cluster>
          </Cluster>
          {(responseMessage?.status === 'success' || responseMessage?.status === 'error') && (
            <div className={message()}>
              <ResponseMessage type={responseMessage.status} role="alert">
                {responseMessage.text}
              </ResponseMessage>
            </div>
          )}
        </Stack>
      </form>
    </Section>
  )
}
