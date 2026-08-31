'use client'

import { type FC, type FormEvent, type PropsWithChildren, useContext, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { useLatest } from '../../../hooks/useLatest'
import { type ResponseStatus, useResponseStatus } from '../../../hooks/useResponseStatus'
import { Button } from '../../Button'
import { Cluster, Stack } from '../../Layout'
import { Section } from '../../SectioningContent'
import { DialogBody, type Props as DialogBodyProps } from '../DialogBody'
import { DialogContentResponseStatusMessage } from '../DialogContentResponseStatusMessage'
import { DialogHeader } from '../DialogHeader'
import { DialogHeading, type Props as DialogHeadingProps } from '../DialogHeading'
import { dialogContentInner } from '../dialogInnerStyle'

import { StepFormDialogContext, type StepItem } from './StepFormDialogProvider'

import type { CommonButtonType } from './type'

type StepFormHelpers = {
  /** 指定したステップに移動する関数 */
  goto: (nextStep: StepItem) => void
  /** ダイアログを閉じる関数 */
  close: () => void
  /** 現在のステップ情報 */
  currentStep: StepItem
}

export type BaseProps = PropsWithChildren<
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
    handleSubmit: (e: FormEvent<HTMLFormElement>, helpers: StepFormHelpers) => void
    /** キャンセルボタン */
    closeButton: CommonButtonType
    /** 戻るボタン */
    backButton: CommonButtonType
    /**
     * モバイル時の表示形式（'sheet' でボトムシート表示になる）
     */
    mobileType?: 'sheet'
  }
>

export type StepFormDialogContentInnerProps = BaseProps & {
  firstStep: StepItem
  handleClickClose: () => void
  responseStatus?: ResponseStatus
  /** ステップの総数 */
  stepLength: number
  handleClickBack?: () => void
}

const BUTTON_COLUMN_GAP = {
  row: 0.5,
  column: 1,
} as const

// StepFormDialog はフッターのボタン構成（戻る / キャンセル / 送信）が他 Dialog と異なるため、
// sheet 時のレイアウト用クラスを共有 dialogContentInner とは別にこのローカル tv で持つ。
const stepFormDialogFooter = tv({
  slots: {
    // sheet 時、戻る+送信を横並び全幅（各 flex-1）にする上段
    sheetButtonRow: 'shr-flex-nowrap [&>button]:shr-flex-1',
    backButton: 'smarthr-ui-Dialog-backButton',
    closeButton: 'smarthr-ui-Dialog-closeButton',
    submitButton: 'smarthr-ui-Dialog-actionButton',
  },
  variants: {
    mobileType: {
      // sheet 時はキャンセルを全幅で下段に配置する
      sheet: {
        closeButton: 'shr-w-full',
      },
    },
  },
})

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
  handleSubmit,
  handleClickClose,
  responseStatus,
  handleClickBack,
  mobileType,
  mobile,
}) => {
  const { currentStep, stepQueueRef, setCurrentStep, scrollerRef } =
    useContext(StepFormDialogContext)
  const isSheet = mobileType === 'sheet'

  const latest = useLatest({
    handleClickClose,
    handleSubmit,
    handleClickBack,
    currentStep,
    firstStep,
    setCurrentStep,
    stepQueueRef,
    scrollerRef,
  })

  const functions = useMemo(() => {
    const handleCloseAction = () => {
      latest.handleClickClose()
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

        latest.handleSubmit(e, helpers)
      },
      handleBackAction: () => {
        latest.handleClickBack?.()

        changeCurrentStep(latest.stepQueueRef.current.pop() ?? latest.firstStep)
      },
    }
  }, [latest])

  const classNames = useMemo(() => {
    const { wrapper, actionArea, buttonArea, message } = dialogContentInner()
    const footer = stepFormDialogFooter()
    const commonAttrs = { mobileType }

    return {
      wrapper: wrapper(commonAttrs),
      actionArea: actionArea({ mobile, mobileType }),
      buttonArea: buttonArea(commonAttrs),
      message: message(),
      sheetButtonRow: footer.sheetButtonRow(),
      backButton: footer.backButton(),
      closeButton: footer.closeButton(commonAttrs),
      submitButton: footer.submitButton(),
    }
  }, [mobileType, mobile])

  const stepText = stepLength > 1 ? `（${activeStep}/${stepLength}）` : ''

  const calcedResponseStatus = useResponseStatus(responseStatus)

  const backButtonElement = !backButton.hidden && activeStep > 1 && (
    <Button
      disabled={backButton.disabled || calcedResponseStatus.isProcessing}
      variant={backButton.theme}
      className={classNames.backButton}
      onClick={functions.handleBackAction}
    >
      {backButton.text}
    </Button>
  )
  const closeButtonElement = !closeButton.hidden && (
    <Button
      disabled={closeButton.disabled || calcedResponseStatus.isProcessing}
      // sheet かつ mobile 時はボトムシートの装飾に合わせ、明示 theme に関わらず tertiary にする
      variant={isSheet ? 'tertiary' : closeButton.theme}
      className={classNames.closeButton}
      onClick={functions.handleCloseAction}
    >
      {closeButton.text}
    </Button>
  )
  const submitButtonElement = !submitButton.hidden && (
    <Button
      type="submit"
      disabled={submitButton.disabled}
      loading={calcedResponseStatus.isProcessing}
      variant={submitButton.theme}
      className={classNames.submitButton}
    >
      {submitButton.text}
    </Button>
  )

  return (
    // eslint-disable-next-line smarthr/a11y-prohibit-sectioning-content-in-form
    <Section>
      <form onSubmit={functions.handleSubmitAction}>
        <div className={classNames.wrapper}>
          <DialogHeader mobileType={mobileType}>
            <DialogHeading
              id={heading.id}
              sub={heading.sub ? `${heading.sub}${stepText}` : undefined}
              text={heading.sub ? heading.text : `${heading.text}${stepText}`}
            />
          </DialogHeader>
          <DialogBody
            ref={scrollerRef}
            mobile={mobile}
            contentPadding={contentPadding}
            contentBgColor={contentBgColor}
          >
            {children}
          </DialogBody>
          <div className={classNames.actionArea}>
            {isSheet ? (
              <Stack gap={0.5}>
                <Cluster gap={BUTTON_COLUMN_GAP} className={classNames.sheetButtonRow}>
                  {backButtonElement}
                  {submitButtonElement}
                </Cluster>
                {closeButtonElement}
              </Stack>
            ) : (
              <Cluster justify="space-between" gap={{ row: 0.5, column: 2 }}>
                {backButtonElement}
                <Cluster gap={BUTTON_COLUMN_GAP} className={classNames.buttonArea}>
                  {closeButtonElement}
                  {submitButtonElement}
                </Cluster>
              </Cluster>
            )}
            <DialogContentResponseStatusMessage
              responseStatus={calcedResponseStatus}
              className={classNames.message}
            />
          </div>
        </div>
      </form>
    </Section>
  )
}
