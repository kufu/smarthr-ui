'use client'

import {
  type FC,
  type FormEvent,
  type PropsWithChildren,
  type ReactNode,
  memo,
  useContext,
  useMemo,
} from 'react'

import { useLatest } from '../../../hooks/useLatest'
import { type ResponseStatus, useResponseStatus } from '../../../hooks/useResponseStatus'
import { Button } from '../../Button'
import { Cluster } from '../../Layout'
import { Section } from '../../SectioningContent'
import { DialogBody, type Props as DialogBodyProps } from '../DialogBody'
import { DialogContentResponseStatusMessage } from '../DialogContentResponseStatusMessage'
import { DialogHeading, type Props as DialogHeadingProps } from '../DialogHeading'
import { dialogContentInner } from '../dialogInnerStyle'

import { StepFormDialogContext, type StepItem } from './StepFormDialogProvider'

import type { useStepFormDialogButton } from './useStepFormDialogButton'

type StepFormHelpers = {
  /** 指定したステップに移動する関数 */
  goto: (nextStep: StepItem) => void
  /** ダイアログを閉じる関数 */
  close: () => void
  /** 現在のステップ情報 */
  currentStep: StepItem
}

type CommonButtonType = ReturnType<typeof useStepFormDialogButton>

export type AbstractProps = PropsWithChildren<
  DialogBodyProps & {
    /** ダイアログタイトル */
    heading: DialogHeadingProps
    /** 現在のStepNo */
    activeStep: number
    /** submitボタン */
    submitButton: CommonButtonType
    /**
     * アクションボタンをクリックした時に発火するコールバック関数
     * @param e フォームイベント
     * @param helpers ステップ操作用のヘルパー関数群
     */
    onSubmit: (e: FormEvent<HTMLFormElement>, helpers: StepFormHelpers) => void
    /** キャンセルボタン */
    closeButton: CommonButtonType
    /** 戻るボタン */
    backButton: CommonButtonType
  }
>

export type StepFormDialogContentInnerProps = AbstractProps & {
  firstStep: StepItem
  onClickClose: () => void
  responseStatus?: ResponseStatus
  /** ステップの総数 */
  stepLength: number
  onClickBack?: () => void
}

const BUTTON_COLUMN_GAP = {
  row: 0.5,
  column: 1,
} as const

const CLASS_NAMES = (() => {
  const { wrapper, actionArea, buttonArea, message } = dialogContentInner()

  return {
    wrapper: wrapper(),
    actionArea: actionArea(),
    buttonArea: buttonArea(),
    message: message(),
  }
})()

export const StepFormDialogContentInner: FC<StepFormDialogContentInnerProps> = ({
  children,
  heading,
  activeStep,
  contentBgColor,
  contentPadding,
  submitButton,
  closeButton,
  backButton,
  stepLength,
  firstStep,
  onSubmit,
  onClickClose,
  responseStatus,
  onClickBack,
}) => {
  const { currentStep, stepQueueRef, setCurrentStep, scrollerRef } =
    useContext(StepFormDialogContext)

  const latest = useLatest({
    onClickClose,
    onSubmit,
    onClickBack,
    currentStep,
    firstStep,
    setCurrentStep,
    stepQueueRef,
    scrollerRef,
  })

  const functions = useMemo(() => {
    const handleCloseAction = () => {
      latest.onClickClose()
      setTimeout(() => {
        // HINT: ダイアログが閉じるtransitionが完了してから初期化をしている
        latest.stepQueueRef.current = []
        latest.setCurrentStep(latest.firstStep)
      }, 300)
    }

    const changeCurrentStep = (step: Parameters<typeof setCurrentStep>[0]) => {
      latest.setCurrentStep(step)

      // HINT: stepが切り替わるごとにbodyのscroll位置を先頭に戻す処理
      if (latest.scrollerRef.current) {
        latest.scrollerRef.current.scroll(0, 0)
      }
    }

    return {
      handleCloseAction,
      handleSubmitAction: (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        // HINT: React Potals などで擬似的にformがネストしている場合など、stopPropagationを実行しないと
        // 親formが意図せずsubmitされてしまう場合がある
        e.stopPropagation()

        const helpers: StepFormHelpers = {
          goto: (nextStep: StepItem) => {
            latest.stepQueueRef.current.push(latest.currentStep)
            changeCurrentStep(nextStep)
          },
          close: handleCloseAction,
          currentStep: latest.currentStep,
        }

        latest.onSubmit(e, helpers)
      },
      handleBackAction: () => {
        latest.onClickBack?.()

        changeCurrentStep(latest.stepQueueRef.current.pop() ?? latest.firstStep)
      },
    }
  }, [latest])

  const stepText = stepLength > 1 ? `（${activeStep}/${stepLength}）` : ''

  const calcedResponseStatus = useResponseStatus(responseStatus)

  return (
    // eslint-disable-next-line smarthr/a11y-prohibit-sectioning-content-in-form
    <Section>
      <form onSubmit={functions.handleSubmitAction}>
        <div className={CLASS_NAMES.wrapper}>
          <DialogHeading
            id={heading.id}
            sub={heading.sub ? `${heading.sub}${stepText}` : undefined}
            text={heading.sub ? heading.text : `${heading.text}${stepText}`}
          />
          <DialogBody
            contentPadding={contentPadding}
            contentBgColor={contentBgColor}
            ref={scrollerRef}
          >
            {children}
          </DialogBody>
          <div className={CLASS_NAMES.actionArea}>
            <Cluster justify="space-between" gap={{ row: 0.5, column: 2 }}>
              {!backButton.hidden && activeStep > 1 && (
                <BackButton
                  onClick={functions.handleBackAction}
                  variant={backButton.theme}
                  disabled={backButton.disabled || calcedResponseStatus.isProcessing}
                  text={backButton.text}
                />
              )}
              <Cluster gap={BUTTON_COLUMN_GAP} className={CLASS_NAMES.buttonArea}>
                {!closeButton.hidden && (
                  <CloseButton
                    onClick={functions.handleCloseAction}
                    variant={closeButton.theme}
                    disabled={closeButton.disabled || calcedResponseStatus.isProcessing}
                    text={closeButton.text}
                  />
                )}
                {!submitButton.hidden && (
                  <SubmitButton
                    variant={submitButton.theme}
                    disabled={submitButton.disabled}
                    loading={calcedResponseStatus.isProcessing}
                    text={submitButton.text}
                  />
                )}
              </Cluster>
            </Cluster>
            <DialogContentResponseStatusMessage
              responseStatus={calcedResponseStatus}
              className={CLASS_NAMES.message}
            />
          </div>
        </div>
      </form>
    </Section>
  )
}

const BackButton = memo<{
  onClick: () => void
  variant: CommonButtonType['theme']
  disabled: boolean
  text: ReactNode
}>(({ onClick, variant, disabled, text }) => (
  <Button
    onClick={onClick}
    variant={variant}
    disabled={disabled}
    className="smarthr-ui-Dialog-backButton"
  >
    {text}
  </Button>
))

const CloseButton = memo<{
  onClick: () => void
  variant: CommonButtonType['theme']
  disabled: boolean
  text: ReactNode
}>(({ onClick, variant, disabled, text }) => (
  <Button
    onClick={onClick}
    variant={variant}
    disabled={disabled}
    className="smarthr-ui-Dialog-closeButton"
  >
    {text}
  </Button>
))

const SubmitButton = memo<{
  variant: CommonButtonType['theme']
  disabled: boolean | undefined
  loading: boolean
  text: ReactNode
}>(({ variant, disabled, loading, text }) => (
  <Button
    type="submit"
    variant={variant}
    disabled={disabled}
    loading={loading}
    className="smarthr-ui-Dialog-actionButton"
  >
    {text}
  </Button>
))
