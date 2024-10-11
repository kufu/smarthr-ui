import React, {
  type FC,
  type FormEvent,
  type PropsWithChildren,
  type ReactNode,
  useCallback,
  useMemo,
} from 'react'

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
      submitLabel: ReactNode
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
      /** コンポーネント内の文言を変更するための関数を設定 */
      decorators?: DecoratorsType<'closeButtonLabel' | 'nextButtonLabel' | 'backButtonLabel'>
    }
>

export type StepFormDialogContentInnerProps = BaseProps & {
  onClickClose: () => void
  responseMessage?: ResponseMessageType
  activeStep: number
  stepLength: number
  onClickNext?: () => void
  onClickBack?: () => void
}

const CLOSE_BUTTON_LABEL = 'キャンセル'
const NEXT_BUTTON_LABEL = '次へ'
const BACK_BUTTON_LABEL = '戻る'

export const StepFormDialogContentInner: FC<StepFormDialogContentInnerProps> = ({
  children,
  title,
  titleId,
  subtitle,
  titleTag,
  contentBgColor,
  contentPadding,
  submitLabel,
  actionTheme = 'primary',
  activeStep,
  stepLength,
  onSubmit,
  onClickClose,
  responseMessage,
  actionDisabled = false,
  closeDisabled,
  decorators,
  onClickNext,
  onClickBack,
}) => {
  const handleSubmitAction = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      console.log('handleSubmitAction', activeStep)
      e.preventDefault()
      // HINT: React Potals などで擬似的にformがネストしている場合など、stopPropagationを実行しないと
      // 親formが意図せずsubmitされてしまう場合がある
      e.stopPropagation()
      console.log('onSubmit', activeStep)
      onSubmit(onClickClose, e)
    },
    [activeStep, onSubmit, onClickClose],
  )

  const isRequestProcessing = responseMessage && responseMessage.status === 'processing'

  const { wrapper, actionArea, buttonArea, message } = dialogContentInner()

  const actionText =
    activeStep === stepLength - 1
      ? submitLabel
      : decorators?.nextButtonLabel?.(NEXT_BUTTON_LABEL) || NEXT_BUTTON_LABEL

  return (
    // eslint-disable-next-line smarthr/a11y-heading-in-sectioning-content
    <Section>
      <form onSubmit={handleSubmitAction}>
        {/* eslint-disable-next-line smarthr/best-practice-for-layouts */}
        <Stack gap={0} className={wrapper()}>
          <DialogHeader
            title={`${title} ${activeStep + 1}/${stepLength}`}
            subtitle={subtitle}
            titleTag={titleTag}
            titleId={titleId}
          />
          <DialogBody contentPadding={contentPadding} contentBgColor={contentBgColor}>
            {children}
          </DialogBody>
          <Stack gap={0.5} className={actionArea()}>
            <Cluster justify="space-between">
              {activeStep > 0 && (
                <Button onClick={onClickBack}>
                  {decorators?.backButtonLabel?.(BACK_BUTTON_LABEL) || BACK_BUTTON_LABEL}
                </Button>
              )}
              <Cluster gap={{ row: 0.5, column: 1 }} className={buttonArea()}>
                <Button
                  onClick={onClickClose}
                  disabled={closeDisabled || isRequestProcessing}
                  className="smarthr-ui-Dialog-closeButton"
                >
                  {decorators?.closeButtonLabel?.(CLOSE_BUTTON_LABEL) || CLOSE_BUTTON_LABEL}
                </Button>
                <Button
                  type={activeStep === stepLength - 1 ? 'submit' : 'button'}
                  variant={actionTheme}
                  disabled={actionDisabled}
                  loading={isRequestProcessing}
                  className="smarthr-ui-Dialog-actionButton"
                  onClick={onClickNext}
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
        </Stack>
      </form>
    </Section>
  )
}
