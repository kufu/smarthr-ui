import React, {
  type FC,
  type FormEvent,
  type PropsWithChildren,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
} from 'react'

import { type DecoratorsType, useDecorators } from '../../../hooks/useDecorators'
import { Button } from '../../Button'
import { Cluster, Stack } from '../../Layout'
import { ResponseMessage } from '../../ResponseMessage'
import { Section } from '../../SectioningContent'
import { DialogBody, Props as DialogBodyProps } from '../DialogBody'
import { DialogHeader, type Props as DialogHeaderProps } from '../DialogHeader'
import { dialogContentInner } from '../dialogInnerStyle'

import { StepFormDialogContext, StepItem } from './StepFormDialogProvider'

import type { ResponseMessageType } from '../../../types'

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
       * @param currentStep onSubmitが発火した時のステップ
       * @returns 次のステップに遷移する場合は次のステップ、遷移しない場合はundefined
       */
      onSubmit: (
        closeDialog: () => void,
        e: FormEvent<HTMLFormElement>,
        currentStep: StepItem,
      ) => StepItem | undefined
      /** アクションボタンを無効にするかどうか */
      actionDisabled?: boolean
      /** 閉じるボタンを無効にするかどうか */
      closeDisabled?: boolean
      /** コンポーネント内の文言を変更するための関数を設定 */
      decorators?: DecoratorsType<DecoratorKeyTypes>
    }
>

export type StepFormDialogContentInnerProps = BaseProps & {
  firstStep: StepItem
  onClickClose: () => void
  responseMessage?: ResponseMessageType
  stepLength: number
  onClickBack?: () => void
}

const DECORATOR_DEFAULT_TEXTS = {
  closeButtonLabel: 'キャンセル',
  nextButtonLabel: '次へ',
  backButtonLabel: '戻る',
} as const
type DecoratorKeyTypes = keyof typeof DECORATOR_DEFAULT_TEXTS

const BUTTON_COLUMN_GAP = {
  row: 0.5,
  column: 1,
} as const

export const StepFormDialogContentInner: FC<StepFormDialogContentInnerProps> = ({
  children,
  title,
  titleId,
  subtitle,
  contentBgColor,
  contentPadding,
  submitLabel,
  actionTheme = 'primary',
  stepLength,
  firstStep,
  onSubmit,
  onClickClose,
  responseMessage,
  actionDisabled,
  closeDisabled,
  decorators,
  onClickBack,
}) => {
  const { currentStep, stepQueue, setCurrentStep } = useContext(StepFormDialogContext)
  const activeStep = useMemo(() => currentStep?.stepNumber ?? 1, [currentStep])

  const handleCloseAction = useCallback(() => {
    onClickClose()
    setTimeout(() => {
      // HINT: ダイアログが閉じるtransitionが完了してから初期化をしている
      stepQueue.current = []
      setCurrentStep(firstStep)
    }, 300)
  }, [firstStep, stepQueue, setCurrentStep, onClickClose])

  const handleSubmitAction = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      // HINT: React Potals などで擬似的にformがネストしている場合など、stopPropagationを実行しないと
      // 親formが意図せずsubmitされてしまう場合がある
      e.stopPropagation()

      stepQueue.current.push(currentStep)
      const next = onSubmit(handleCloseAction, e, currentStep)
      if (!next) {
        return
      }
      setCurrentStep(next)
    },
    [currentStep, stepQueue, onSubmit, setCurrentStep, handleCloseAction],
  )
  const handleBackAction = useCallback(() => {
    onClickBack?.()
    const prev = stepQueue.current.pop() ?? firstStep
    setCurrentStep(prev)
  }, [firstStep, stepQueue, onClickBack, setCurrentStep])

  const isRequestProcessing = responseMessage && responseMessage.status === 'processing'

  const classNames = useMemo(() => {
    const { wrapper, actionArea, buttonArea, message } = dialogContentInner()

    return {
      wrapper: wrapper(),
      actionArea: actionArea(),
      buttonArea: buttonArea(),
      message: message(),
    }
  }, [])

  const decorated = useDecorators<DecoratorKeyTypes>(DECORATOR_DEFAULT_TEXTS, decorators)

  const actionText = useMemo(
    () => (activeStep === stepLength ? submitLabel : decorated.nextButtonLabel),
    [activeStep, stepLength, submitLabel, decorated.nextButtonLabel],
  )

  return (
    // eslint-disable-next-line smarthr/a11y-heading-in-sectioning-content
    <Section>
      <form onSubmit={handleSubmitAction}>
        {/* eslint-disable-next-line smarthr/best-practice-for-layouts */}
        <Stack gap={0} className={classNames.wrapper}>
          <DialogHeader
            title={`${title} ${activeStep}/${stepLength}`}
            subtitle={subtitle}
            titleId={titleId}
          />
          <DialogBody contentPadding={contentPadding} contentBgColor={contentBgColor}>
            {children}
          </DialogBody>
          <Stack gap={0.5} className={classNames.actionArea}>
            <Cluster justify="space-between">
              {activeStep > 1 && (
                <Button
                  onClick={handleBackAction}
                  disabled={isRequestProcessing}
                  className="smarthr-ui-Dialog-backButton"
                >
                  {decorated.backButtonLabel}
                </Button>
              )}
              <Cluster gap={BUTTON_COLUMN_GAP} className={classNames.buttonArea}>
                <Button
                  onClick={handleCloseAction}
                  disabled={closeDisabled || isRequestProcessing}
                  className="smarthr-ui-Dialog-closeButton"
                >
                  {decorated.closeButtonLabel}
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
              <div className={classNames.message}>
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
