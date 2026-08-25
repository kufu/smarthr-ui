'use client'

import {
  type ComponentProps,
  type FC,
  type FormEvent,
  type ReactNode,
  useContext,
  useMemo,
  useRef,
} from 'react'

import { useLatest } from '../../../hooks/useLatest'
import { useObjectAttributes } from '../../../hooks/useObjectAttributes'
import { useLocalize } from '../../../intl'
import { DialogContentInner } from '../DialogContentInner'
import { useDialogPortal } from '../useDialogPortal'
import { useObjectHeading } from '../useObjectHeading'

import {
  type BaseProps as BaseStepFormDialogContentInnerProps,
  StepFormDialogContentInner,
  type StepFormDialogContentInnerProps,
} from './StepFormDialogContentInner'
import { StepFormDialogContext, StepFormDialogProvider } from './StepFormDialogProvider'

import type { FocusTrapRef } from '../FocusTrap'
import type { DialogProps /** コンテンツなにもないDialogの基本props */ } from '../types'
import type { StepItem } from './StepFormDialogProvider'
import type { ButtonArgType, ButtonThemeType, CommonButtonType, ObjectButtonType } from './type'

type ObjectHeadingType = Omit<StepFormDialogContentInnerProps['heading'], 'id'>
type HeadingType = ReactNode | ObjectHeadingType

type BaseProps = Omit<
  StepFormDialogContentInnerProps,
  | 'heading'
  | 'activeStep'
  | 'submitButton'
  | 'closeButton'
  | 'backButton'
  | 'handleClickClose'
  | 'handleClickBack'
  | 'handleSubmit'
> &
  DialogProps & {
    heading: HeadingType
    submitButton: ButtonArgType | ObjectButtonType
    closeButton?: ButtonArgType | ObjectButtonType
    backButton?: ButtonArgType | ObjectButtonType
    onSubmit: BaseStepFormDialogContentInnerProps['handleSubmit']
    onClickClose: () => void
    onClickBack?: () => void
  }
type Props = BaseProps & Omit<ComponentProps<'div'>, keyof BaseProps>

const headingObjectConverter = (text: ReactNode) => ({ text })

const buttonObjectConverter = (text: ButtonArgType): ObjectButtonType => ({
  text,
})

type UseStepFormDialogButtonProps = {
  button: ButtonArgType | ObjectButtonType
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
  } = useObjectAttributes<ButtonArgType | ObjectButtonType, ObjectButtonType>(
    button,
    buttonObjectConverter,
  )

  const actualButton = useMemo((): CommonButtonType => {
    let text = tempText ?? defaultText
    let textFunc = false

    if (typeof text === 'function') {
      textFunc = true
      text = text(currentStep, defaultText)
    }

    const actualTempTheme = tempTheme || defaultTheme
    const theme =
      typeof actualTempTheme === 'function' ? actualTempTheme(currentStep) : actualTempTheme
    const disabled = typeof tempDisabled === 'function' ? tempDisabled(currentStep) : tempDisabled
    const hidden = typeof tempHidden === 'function' ? tempHidden(currentStep) : tempHidden

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

export const ControlledStepFormDialog: FC<Props> = ({ portalParent, id, firstStep, ...rest }) => {
  const { createPortal } = useDialogPortal(portalParent, id)

  return createPortal(
    <StepFormDialogProvider firstStep={firstStep}>
      <ActualControlledStepFormDialog {...rest} firstStep={firstStep} />
    </StepFormDialogProvider>,
  )
}

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
  mobileType,
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

  const focusTrapRef = useRef<FocusTrapRef>(null)

  const latest = useLatest({ onClickClose, onSubmit, onClickBack, isOpen })

  const functions = useMemo(
    () => ({
      handleClickClose: () => {
        if (latest.isOpen) {
          focusTrapRef.current?.focus()
          latest.onClickClose()
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
      mobileType={mobileType}
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
        mobileType={mobileType}
      >
        {children}
      </StepFormDialogContentInner>
    </DialogContentInner>
  )
}
