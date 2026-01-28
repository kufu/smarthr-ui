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
import { DialogHeading, type Props as DialogHeadingProps } from '../DialogHeading'
import { dialogContentInner } from '../dialogInnerStyle'

import { StepFormDialogContext, type StepItem } from './StepFormDialogProvider'

export type AbstractProps = PropsWithChildren<
  DialogBodyProps & {
    /** ダイアログタイトル */
    heading: DialogHeadingProps
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

export type StepFormDialogContentInnerProps = AbstractProps & {
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
  heading,
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

      const next = onSubmit(handleCloseAction, e, currentStep)

      if (next) {
        stepQueue.current.push(currentStep)
        changeCurrentStep(next)
      }
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
    // eslint-disable-next-line smarthr/a11y-prohibit-sectioning-content-in-form
    <Section>
      <form onSubmit={handleSubmitAction}>
        <div className={classNames.wrapper}>
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
