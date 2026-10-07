'use client'

import {
  type ComponentPropsWithRef,
  type FC,
  type FormEvent,
  type MouseEvent,
  type ReactNode,
  isValidElement,
  useContext,
  useMemo,
  useRef,
} from 'react'

import { useLatest } from '../../../hooks/useLatest'
import { useObjectAttributes } from '../../../hooks/useObjectAttributes'
import { useLocalize } from '../../../intl'
import { DialogContentInner } from '../DialogContentInner'
import { DialogPortal } from '../DialogPortal'
import { useObjectHeading } from '../useObjectHeading'

import { StepFormDialogContentInner } from './StepFormDialogContentInner'
import { StepFormDialogContext, StepFormDialogProvider } from './StepFormDialogProvider'

import type { DialogProps /** コンテンツなにもないDialogの基本props */ } from '../types'
import type { ButtonThemeType, CommonButtonType, StepItem } from './type'
import type { SHRComponentProps, SHRComponentPropsWithRef } from '../../../types'

type ButtonArgType = ReactNode | ((currentStep: StepItem, defaultText: ReactNode) => ReactNode)

type VariableFunctionType<T> = (currentStep: StepItem) => T
type ObjectButtonType = {
  text?: ButtonArgType
  /** ボタンを非表示にするかどうか */
  hidden?: boolean | VariableFunctionType<boolean>
  /** ボタンを無効にするかどうか */
  disabled?: boolean | VariableFunctionType<boolean>
  /** ボタンのスタイル */
  theme?: ButtonThemeType | VariableFunctionType<ButtonThemeType>
}

/** text/theme/disabled/hiddenをまとめて1つの関数で解決する場合の戻り値。関数のネストは許容しない */
type ButtonResolverResult = {
  text?: ReactNode
  theme?: ButtonThemeType
  disabled?: boolean
  hidden?: boolean
}
/** currentStepに応じてtext/theme/disabled/hiddenをまとめて返す関数形式 */
type ButtonResolverType = (currentStep: StepItem, defaultText: ReactNode) => ButtonResolverResult

type ButtonType = ButtonArgType | ObjectButtonType | ButtonResolverType

// HINT: ButtonArgTypeの関数部分とButtonResolverTypeはどちらも`(currentStep, defaultText) => ...`という
// 同じ引数形だが、戻り値がReactNodeかButtonResolverResultかで実行時に判別する
const isButtonResolverResult = (value: unknown): value is ButtonResolverResult =>
  !!value && typeof value === 'object' && !Array.isArray(value) && !isValidElement(value)

type StepFormDialogContentInnerProps = ComponentPropsWithRef<typeof StepFormDialogContentInner>

type ObjectHeadingType = Omit<StepFormDialogContentInnerProps['heading'], 'id'>
type HeadingType = ReactNode | ObjectHeadingType

type Props = SHRComponentPropsWithRef<
  typeof DialogContentInner,
  SHRComponentProps<
    StepFormDialogContentInnerProps,
    DialogProps & {
      heading: HeadingType
      submitButton: ButtonType
      closeButton?: ButtonType
      backButton?: ButtonType
      onSubmit: StepFormDialogContentInnerProps['handleSubmit']
      onClickClose: (e?: MouseEvent<HTMLButtonElement> | KeyboardEvent) => void
      onClickBack?: () => void
    },
    { omit: 'activeStep' | 'handleClickClose' | 'handleClickBack' | 'handleSubmit' }
  >,
  { omit: 'focusTrapRef' }
>

const headingObjectConverter = (text: ReactNode) => ({ text })

// HINT: ButtonResolverType(関数)もtextとして保持し、呼び出し後にisButtonResolverResultで判別する
type InternalObjectButtonType = Omit<ObjectButtonType, 'text'> & {
  text?: ButtonArgType | ButtonResolverType
}

const buttonObjectConverter = (
  text: ButtonArgType | ButtonResolverType,
): InternalObjectButtonType => ({
  text,
})

type UseStepFormDialogButtonProps = {
  button: ButtonType
  currentStep: StepItem
  defaultValues: {
    text: ReactNode
    theme?: ButtonThemeType
  }
}

const useStepFormDialogButton = ({
  button,
  currentStep,
  defaultValues: { text: defaultText, theme: defaultTheme },
}: UseStepFormDialogButtonProps): CommonButtonType => {
  const {
    text: tempText,
    theme: tempTheme,
    disabled: tempDisabled,
    hidden: tempHidden,
  } = useObjectAttributes<ButtonType, InternalObjectButtonType>(button, buttonObjectConverter)

  const actualButton = useMemo((): CommonButtonType => {
    let text = tempText ?? defaultText
    let textFunc = false
    let actualTempTheme = tempTheme
    let actualTempDisabled = tempDisabled
    let actualTempHidden = tempHidden

    if (typeof text === 'function') {
      textFunc = true

      const result = text(currentStep, defaultText)

      if (isButtonResolverResult(result)) {
        text = result.text ?? defaultText
        actualTempTheme = result.theme ?? actualTempTheme
        actualTempDisabled = result.disabled ?? actualTempDisabled
        actualTempHidden = result.hidden ?? actualTempHidden
      } else {
        text = result
      }
    }

    const actualTheme = actualTempTheme || defaultTheme
    const theme = typeof actualTheme === 'function' ? actualTheme(currentStep) : actualTheme
    const disabled =
      typeof actualTempDisabled === 'function'
        ? actualTempDisabled(currentStep)
        : actualTempDisabled
    const hidden =
      typeof actualTempHidden === 'function' ? actualTempHidden(currentStep) : actualTempHidden

    return {
      text,
      theme,
      disabled,
      hidden,
      functionCall: {
        text: textFunc,
      },
    }
  }, [currentStep, tempText, tempTheme, tempDisabled, tempHidden, defaultText, defaultTheme])

  return actualButton
}

export const ControlledStepFormDialog: FC<Props> = ({ portalParent, id, firstStep, ...rest }) => (
  <DialogPortal id={id} parent={portalParent}>
    <StepFormDialogProvider firstStep={firstStep}>
      <ActualControlledStepFormDialog {...rest} firstStep={firstStep} />
    </StepFormDialogProvider>
  </DialogPortal>
)

const ActualControlledStepFormDialog: FC<Omit<Props, 'portalParent'>> = ({
  children,
  heading: orgHeading,
  stepLength,
  contentBgColor,
  contentPadding,
  submitButton: originalSubmitButton,
  closeButton: originalCloseButton,
  backButton: originalBackButton,
  firstStep,
  onSubmit,
  onClickClose,
  onClickBack,
  onPressEscape = onClickClose,
  responseStatus,
  className,
  isOpen,
  ...rest
}) => {
  const defaultTexts = useLocalize({
    closeButtonLabel: {
      id: 'smarthr-ui/StepFormDialog/closeButtonLabel',
      defaultText: 'キャンセル',
    },
    nextButtonLabel: {
      id: 'smarthr-ui/StepFormDialog/nextButtonLabel',
      defaultText: '次へ',
    },
    backButtonLabel: {
      id: 'smarthr-ui/StepFormDialog/backButtonLabel',
      defaultText: '戻る',
    },
  })
  const { currentStep } = useContext(StepFormDialogContext)
  const activeStep = currentStep?.stepNumber ?? 1

  const heading = useObjectHeading<HeadingType, ObjectHeadingType>(
    orgHeading,
    headingObjectConverter,
  )

  const tempSubmitButton = useStepFormDialogButton({
    button: originalSubmitButton,
    currentStep,
    defaultValues: {
      text: defaultTexts.nextButtonLabel,
      theme: 'primary' as const,
    },
  })
  const submitButton = useMemo(
    () => ({
      ...tempSubmitButton,
      text:
        tempSubmitButton.functionCall.text || activeStep === stepLength
          ? tempSubmitButton.text
          : defaultTexts.nextButtonLabel,
    }),
    [tempSubmitButton, activeStep, stepLength, defaultTexts.nextButtonLabel],
  )
  const closeButton = useStepFormDialogButton({
    button: originalCloseButton,
    currentStep,
    defaultValues: {
      text: defaultTexts.closeButtonLabel,
    },
  })
  const backButton = useStepFormDialogButton({
    button: originalBackButton,
    currentStep,
    defaultValues: {
      text: defaultTexts.backButtonLabel,
    },
  })

  const focusTrapRef = useRef<{ focus: () => void } | null>(null)

  const latest = useLatest({ onClickClose, onSubmit, onClickBack, isOpen })

  const functions = useMemo(
    () => ({
      handleClickClose: (e?: MouseEvent<HTMLButtonElement>) => {
        if (latest.isOpen) {
          focusTrapRef.current?.focus()
          latest.onClickClose(e)
        }
      },
      handleSubmit: (e: FormEvent<HTMLFormElement>, helpers: Parameters<typeof onSubmit>[1]) => {
        if (latest.isOpen) {
          focusTrapRef.current?.focus()
          latest.onSubmit(e, helpers)
        }
      },
      handleClickBack: () => {
        if (latest.isOpen) {
          focusTrapRef.current?.focus()
          latest.onClickBack?.()
        }
      },
    }),
    [latest],
  )

  return (
    <DialogContentInner
      {...rest}
      focusTrapRef={focusTrapRef}
      isOpen={isOpen}
      className={className}
      ariaLabelledby={heading.id}
      onPressEscape={closeButton.disabled ? undefined : onPressEscape}
    >
      <StepFormDialogContentInner
        activeStep={activeStep}
        contentBgColor={contentBgColor}
        contentPadding={contentPadding}
        firstStep={firstStep}
        stepLength={stepLength}
        responseStatus={responseStatus}
        handleClickClose={functions.handleClickClose}
        handleSubmit={functions.handleSubmit}
        handleClickBack={functions.handleClickBack}
        heading={heading}
        submitButton={submitButton}
        closeButton={closeButton}
        backButton={backButton}
      >
        {children}
      </StepFormDialogContentInner>
    </DialogContentInner>
  )
}
