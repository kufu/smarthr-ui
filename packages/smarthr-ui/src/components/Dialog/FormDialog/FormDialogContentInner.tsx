import React, {
  type FC,
  type FormEvent,
  type PropsWithChildren,
  type ReactNode,
  useCallback,
  useMemo,
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

const ACTION_AREA_CLUSTER_GAP = { row: 0.5, column: 1 } as const

const formDialogContentInner = tv({
  extend: dialogContentInner,
  slots: {
    form: 'shr-contents',
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

  const calcedResponseStatus = useMemo(() => {
    if (!responseMessage) {
      return {
        isProcessing: false,
        visibleMessage: false,
        status: '',
        message: '',
      }
    }

    const isProcessing = responseMessage.status === 'processing'

    if (isProcessing) {
      return {
        isProcessing,
        visibleMessage: false,
        status: responseMessage.status,
        message: '',
      }
    }

    return {
      isProcessing,
      visibleMessage: true,
      status: responseMessage.status,
      message: responseMessage.text,
    }
  }, [responseMessage])

  const styles = useMemo(() => {
    const { form, wrapper, actionArea, buttonArea, message } = formDialogContentInner()

    return {
      form: form(),
      wrapper: wrapper(),
      actionArea: actionArea(),
      buttonArea: buttonArea(),
      message: message(),
    }
  }, [])

  return (
    // eslint-disable-next-line smarthr/a11y-heading-in-sectioning-content
    <Section className={styles.wrapper}>
      <DialogHeader title={title} subtitle={subtitle} titleTag={titleTag} titleId={titleId} />
      <form onSubmit={handleSubmitAction} className={styles.form}>
        <DialogBody contentPadding={contentPadding} contentBgColor={contentBgColor}>
          {children}
        </DialogBody>
        <Stack gap={0.5} className={styles.actionArea}>
          <Cluster justify="space-between">
            {subActionArea}
            <Cluster gap={ACTION_AREA_CLUSTER_GAP} className={styles.buttonArea}>
              <Button
                onClick={onClickClose}
                disabled={closeDisabled || calcedResponseStatus.isProcessing}
                className="smarthr-ui-Dialog-closeButton"
              >
                {decorators?.closeButtonLabel?.(CLOSE_BUTTON_LABEL) || CLOSE_BUTTON_LABEL}
              </Button>
              <Button
                type="submit"
                variant={actionTheme}
                disabled={actionDisabled}
                loading={calcedResponseStatus.isProcessing}
                className="smarthr-ui-Dialog-actionButton"
              >
                {actionText}
              </Button>
            </Cluster>
          </Cluster>
          {calcedResponseStatus.visibleMessage && (
            <div className={styles.message}>
              <ResponseMessage type={calcedResponseStatus.status} role="alert">
                {calcedResponseStatus.message}
              </ResponseMessage>
            </div>
          )}
        </Stack>
      </form>
    </Section>
  )
}
