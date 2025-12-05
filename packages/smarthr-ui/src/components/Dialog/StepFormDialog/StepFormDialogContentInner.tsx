'use client'

import {
  type FC,
  type FormEvent,
  type PropsWithChildren,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
} from 'react'

import { type DecoratorsType, useDecorators } from '../../../hooks/useDecorators'
import { type ResponseStatus, useResponseStatus } from '../../../hooks/useResponseStatus'
import { useIntl } from '../../../intl'
import { Button } from '../../Button'
import { Cluster, Stack } from '../../Layout'
import { Section } from '../../SectioningContent'
import { DialogBody, type Props as DialogBodyProps } from '../DialogBody'
import { DialogContentResponseStatusMessage } from '../DialogContentResponseStatusMessage'
import { DialogHeader, type Props as DialogHeaderProps } from '../DialogHeader'
import { dialogContentInner } from '../dialogInnerStyle'

import { StepFormDialogContext, type StepItem } from './StepFormDialogProvider'

type StepFormHelpers = {
  /** 指定したステップに移動する関数 */
  goto: (nextStep: StepItem) => void
  /** ダイアログを閉じる関数 */
  close: () => void
  /** 現在のステップ情報 */
  currentStep: StepItem
}

export type BaseProps = PropsWithChildren<
  DialogHeaderProps &
    DialogBodyProps & {
      /** アクションボタンのラベル */
      submitLabel: ReactNode
      /** アクションボタンのスタイル */
      actionTheme?: 'primary' | 'secondary' | 'danger'
      /**
       * アクションボタンをクリックした時に発火するコールバック関数
       * @param e フォームイベント
       * @param helpers ステップ操作用のヘルパー関数群
       */
      onSubmit: (e: FormEvent<HTMLFormElement>, helpers: StepFormHelpers) => void
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
  responseStatus?: ResponseStatus
  /** ステップの総数 */
  stepLength: number
  onClickBack?: () => void
}

type DecoratorKeyTypes = 'closeButtonLabel' | 'nextButtonLabel' | 'backButtonLabel'

const BUTTON_COLUMN_GAP = {
  row: 0.5,
  column: 1,
} as const

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
  stepLength,
  firstStep,
  onSubmit,
  onClickClose,
  responseStatus,
  actionDisabled,
  closeDisabled,
  decorators,
  onClickBack,
}) => {
  const { localize } = useIntl()
  const { currentStep, stepQueue, setCurrentStep, scrollerRef } = useContext(StepFormDialogContext)
  const activeStep = useMemo(() => currentStep?.stepNumber ?? 1, [currentStep])

  const handleCloseAction = useCallback(() => {
    onClickClose()
    setTimeout(() => {
      // HINT: ダイアログが閉じるtransitionが完了してから初期化をしている
      stepQueue.current = []
      setCurrentStep(firstStep)
    }, 300)
  }, [firstStep, stepQueue, setCurrentStep, onClickClose])

  const changeCurrentStep = useCallback(
    (step: Parameters<typeof setCurrentStep>[0]) => {
      setCurrentStep(step)

      // HINT: stepが切り替わるごとにbodyのscroll位置を先頭に戻す処理
      if (scrollerRef.current) {
        scrollerRef.current.scroll(0, 0)
      }
    },
    [setCurrentStep, scrollerRef],
  )

  const handleSubmitAction = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      // HINT: React Potals などで擬似的にformがネストしている場合など、stopPropagationを実行しないと
      // 親formが意図せずsubmitされてしまう場合がある
      e.stopPropagation()

      const helpers: StepFormHelpers = {
        goto: (nextStep: StepItem) => {
          stepQueue.current.push(currentStep)
          changeCurrentStep(nextStep)
        },
        close: handleCloseAction,
        currentStep,
      }

      onSubmit(e, helpers)
    },
    [currentStep, stepQueue, onSubmit, handleCloseAction, changeCurrentStep],
  )
  const handleBackAction = useCallback(() => {
    onClickBack?.()

    changeCurrentStep(stepQueue.current.pop() ?? firstStep)
  }, [firstStep, stepQueue, onClickBack, changeCurrentStep])

  const classNames = useMemo(() => {
    const { wrapper, actionArea, buttonArea, message } = dialogContentInner()

    return {
      wrapper: wrapper(),
      actionArea: actionArea(),
      buttonArea: buttonArea(),
      message: message(),
    }
  }, [])

  const decoratorDefaultTexts = useMemo(
    () => ({
      closeButtonLabel: localize({
        id: 'smarthr-ui/StepFormDialog/closeButtonLabel',
        defaultText: 'キャンセル',
      }),
      nextButtonLabel: localize({
        id: 'smarthr-ui/StepFormDialog/nextButtonLabel',
        defaultText: '次へ',
      }),
      backButtonLabel: localize({
        id: 'smarthr-ui/StepFormDialog/backButtonLabel',
        defaultText: '戻る',
      }),
    }),
    [localize],
  )

  const decorated = useDecorators<DecoratorKeyTypes>(decoratorDefaultTexts, decorators)
  const actionText = activeStep === stepLength ? submitLabel : decorated.nextButtonLabel
  const stepText = stepLength > 1 ? `（${activeStep}/${stepLength}）` : ''

  const calcedResponseStatus = useResponseStatus(responseStatus)

  return (
    // eslint-disable-next-line smarthr/a11y-heading-in-sectioning-content, smarthr/a11y-prohibit-sectioning-content-in-form
    <Section>
      <form onSubmit={handleSubmitAction}>
        <div className={classNames.wrapper}>
          <DialogHeader
            title={subtitle ? title : `${title}${stepText}`}
            subtitle={subtitle ? `${subtitle}${stepText}` : undefined}
            titleTag={titleTag}
            titleId={titleId}
          />
          <DialogBody
            contentPadding={contentPadding}
            contentBgColor={contentBgColor}
            ref={scrollerRef}
          >
            {children}
          </DialogBody>
          <Stack gap={0.5} className={classNames.actionArea}>
            <Cluster justify="space-between" gap={{ row: 0.5, column: 2 }}>
              {activeStep > 1 && (
                <Button
                  onClick={handleBackAction}
                  disabled={calcedResponseStatus.isProcessing}
                  className="smarthr-ui-Dialog-backButton"
                >
                  {decorated.backButtonLabel}
                </Button>
              )}
              <Cluster gap={BUTTON_COLUMN_GAP} className={classNames.buttonArea}>
                <Button
                  onClick={handleCloseAction}
                  disabled={closeDisabled || calcedResponseStatus.isProcessing}
                  className="smarthr-ui-Dialog-closeButton"
                >
                  {decorated.closeButtonLabel}
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
            <DialogContentResponseStatusMessage
              responseStatus={calcedResponseStatus}
              className={classNames.message}
            />
          </Stack>
        </div>
      </form>
    </Section>
  )
}
