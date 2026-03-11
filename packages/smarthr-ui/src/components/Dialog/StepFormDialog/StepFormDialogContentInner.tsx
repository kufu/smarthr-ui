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

import { useObjectAttributes } from '../../../hooks/useObjectAttributes'
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

type ActionThemeType = 'primary' | 'secondary' | 'danger'
type DefaultTextsType = Record<
  'closeButtonLabel' | 'nextButtonLabel' | 'backButtonLabel',
  ReactNode
>
type StepFormHelpers = {
  /** 指定したステップに移動する関数 */
  goto: (nextStep: StepItem) => void
  /** ダイアログを閉じる関数 */
  close: () => void
  /** 現在のステップ情報 */
  currentStep: StepItem
}

export type ButtonArgType =
  | ReactNode
  | ((currentStep: StepItem, defaultTexts: DefaultTextsType) => ReactNode)
type ObjectButtonBaseType = {
  text: ButtonArgType
  hidden: boolean | ((currentStep: StepItem) => boolean)
}
type ObjectSubmitType = ObjectButtonBaseType & {
  /** submitボタンを無効にするかどうか */
  disabled?: boolean
  /** submitボタンのスタイル */
  theme?: ActionThemeType | ((currentStep: StepItem) => ActionThemeType)
}
export type ObjectCloseButtonType = ObjectButtonBaseType & {
  /** キャンセルボタンを無効にするかどうか */
  disabled?: boolean
}
type ObjectBackButtonType = ObjectButtonBaseType

export type AbstractProps = PropsWithChildren<
  DialogBodyProps & {
    /** ダイアログタイトル */
    heading: DialogHeadingProps
    /** submitボタン */
    submitButton: ButtonArgType | ObjectSubmitType
    /**
     * アクションボタンをクリックした時に発火するコールバック関数
     * @param e フォームイベント
     * @param helpers ステップ操作用のヘルパー関数群
     */
    onSubmit: (e: FormEvent<HTMLFormElement>, helpers: StepFormHelpers) => void
    /** キャンセルボタン */
    closeButton: ObjectCloseButtonType
    /** 戻るボタン */
    backButton?: ButtonArgType | ObjectBackButtonType
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

const submitButtonObjectConverter = (text: ButtonArgType): ObjectSubmitType => ({
  text,
  theme: 'primary',
  disabled: false,
  hidden: false,
})
const backButtonObjectConverter = (text: ButtonArgType): ObjectBackButtonType => ({
  text,
  hidden: false,
})

const BUTTON_COLUMN_GAP = {
  row: 0.5,
  column: 1,
} as const

export const StepFormDialogContentInner: FC<StepFormDialogContentInnerProps> = ({
  children,
  heading,
  contentBgColor,
  contentPadding,
  submitButton: originalSubmitButton,
  closeButton: originalCloseButton,
  backButton: originalBackButton,
  stepLength,
  firstStep,
  onSubmit,
  onClickClose,
  responseStatus,
  onClickBack,
}) => {
  const { localize } = useIntl()
  const { currentStep, stepQueue, setCurrentStep, scrollerRef } = useContext(StepFormDialogContext)
  const activeStep = useMemo(() => currentStep?.stepNumber ?? 1, [currentStep])

  const defaultTexts: DefaultTextsType = useMemo(
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

  const tempSubmitButton = useObjectAttributes<ButtonArgType | ObjectSubmitType, ObjectSubmitType>(
    originalSubmitButton,
    submitButtonObjectConverter,
  )
  const submitButton = useMemo(() => {
    const text =
      typeof tempSubmitButton.text === 'function'
        ? tempSubmitButton.text(currentStep, defaultTexts)
        : activeStep === stepLength
          ? tempSubmitButton.text
          : defaultTexts.nextButtonLabel
    const hidden =
      typeof tempSubmitButton.hidden === 'function'
        ? tempSubmitButton.hidden(currentStep)
        : tempSubmitButton.hidden

    const theme =
      typeof tempSubmitButton.theme === 'function'
        ? tempSubmitButton.theme(currentStep)
        : tempSubmitButton.theme || 'primary'

    return {
      ...tempSubmitButton,
      text,
      hidden,
      theme,
    }
  }, [activeStep, currentStep, tempSubmitButton, stepLength, defaultTexts])

  const closeButton = useMemo(() => {
    const text =
      typeof originalCloseButton.text === 'function'
        ? originalCloseButton.text(currentStep, defaultTexts)
        : originalCloseButton.text || defaultTexts.closeButtonLabel
    const hidden =
      typeof originalCloseButton.hidden === 'function'
        ? originalCloseButton.hidden(currentStep)
        : originalCloseButton.hidden

    return {
      ...originalCloseButton,
      text,
      hidden,
    }
  }, [currentStep, originalCloseButton, defaultTexts])

  const tempBackButton = useObjectAttributes<
    ButtonArgType | ObjectBackButtonType,
    ObjectBackButtonType
  >(originalBackButton, backButtonObjectConverter)
  const backButton = useMemo(() => {
    const text =
      typeof tempBackButton.text === 'function'
        ? tempBackButton.text(currentStep, defaultTexts)
        : tempBackButton.text || defaultTexts.backButtonLabel
    const hidden =
      typeof tempBackButton.hidden === 'function'
        ? tempBackButton.hidden(currentStep)
        : tempBackButton.hidden

    return {
      ...tempBackButton,
      text,
      hidden,
    }
  }, [currentStep, tempBackButton, defaultTexts])

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
              {!backButton.hidden && activeStep > 1 && (
                <Button
                  onClick={handleBackAction}
                  disabled={calcedResponseStatus.isProcessing}
                  className="smarthr-ui-Dialog-backButton"
                >
                  {backButton.text}
                </Button>
              )}
              <Cluster gap={BUTTON_COLUMN_GAP} className={classNames.buttonArea}>
                {!closeButton.hidden && (
                  <Button
                    onClick={handleCloseAction}
                    disabled={closeButton.disabled || calcedResponseStatus.isProcessing}
                    className="smarthr-ui-Dialog-closeButton"
                  >
                    {closeButton.text}
                  </Button>
                )}
                {!submitButton.hidden && (
                  <Button
                    type="submit"
                    variant={submitButton.theme}
                    disabled={submitButton.disabled}
                    loading={calcedResponseStatus.isProcessing}
                    className="smarthr-ui-Dialog-actionButton"
                  >
                    {submitButton.text}
                  </Button>
                )}
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
