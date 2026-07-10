'use client'

import {
  type ComponentProps,
  type FC,
  type FormEvent,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
} from 'react'

import { Localizer } from '../../../intl'
import { DialogContentInner } from '../DialogContentInner'
import { useDialogPortal } from '../useDialogPortal'
import { useObjectHeading } from '../useObjectHeading'

import {
  StepFormDialogContentInner,
  type StepFormDialogContentInnerProps,
} from './StepFormDialogContentInner'
import { StepFormDialogContext, StepFormDialogProvider } from './StepFormDialogProvider'
import {
  type ButtonArgType,
  type ObjectButtonType,
  useStepFormDialogButton,
} from './useStepFormDialogButton'

import type { FocusTrapRef } from '../FocusTrap'
import type { DialogProps /** コンテンツなにもないDialogの基本props */ } from '../types'

type ObjectHeadingType = Omit<StepFormDialogContentInnerProps['heading'], 'id'>
type HeadingType = ReactNode | ObjectHeadingType

type AbstractProps = Omit<
  StepFormDialogContentInnerProps,
  'heading' | 'activeStep' | 'submitButton' | 'closeButton' | 'backButton'
> &
  DialogProps & {
    heading: HeadingType
    submitButton: ButtonArgType | ObjectButtonType
    closeButton?: ButtonArgType | ObjectButtonType
    backButton?: ButtonArgType | ObjectButtonType
  }
type Props = AbstractProps & Omit<ComponentProps<'div'>, keyof AbstractProps>

const headingObjectConverter = (text: ReactNode) => ({ text })

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
  ...rest
}) => {
  const { currentStep } = useContext(StepFormDialogContext)
  const activeStep = useMemo(() => currentStep?.stepNumber ?? 1, [currentStep])

  const heading = useObjectHeading<HeadingType, ObjectHeadingType>(
    orgHeading,
    headingObjectConverter,
  )

  const tempSubmitButton = useStepFormDialogButton({
    button: originalSubmitButton,
    currentStep,
    defaultValues: {
      text: <Localizer id="smarthr-ui/StepFormDialog/nextButtonLabel" defaultText="次へ" />,
      theme: 'primary' as const,
    },
  })
  const submitButton = useMemo(
    () => ({
      ...tempSubmitButton,
      text:
        tempSubmitButton.functionCall.text || activeStep === stepLength ? (
          tempSubmitButton.text
        ) : (
          <Localizer id="smarthr-ui/StepFormDialog/nextButtonLabel" defaultText="次へ" />
        ),
    }),
    [tempSubmitButton, activeStep, stepLength],
  )
  const closeButton = useStepFormDialogButton({
    button: originalCloseButton,
    currentStep,
    defaultValues: {
      text: <Localizer id="smarthr-ui/StepFormDialog/closeButtonLabel" defaultText="キャンセル" />,
    },
  })
  const backButton = useStepFormDialogButton({
    button: originalBackButton,
    currentStep,
    defaultValues: {
      text: <Localizer id="smarthr-ui/StepFormDialog/backButtonLabel" defaultText="戻る" />,
    },
  })

  const focusTrapRef = useRef<FocusTrapRef>(null)

  const actualOnClickClose = useCallback(() => {
    if (isOpen) {
      focusTrapRef.current?.focus()
      onClickClose()
    }
  }, [isOpen, onClickClose])

  const onDelegateSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>, helpers: Parameters<typeof onSubmit>[1]) => {
      if (isOpen) {
        focusTrapRef.current?.focus()
        onSubmit(e, helpers)
      }
    },
    [onSubmit, isOpen],
  )

  const actualOnClickBack = useCallback(() => {
    if (isOpen) {
      focusTrapRef.current?.focus()
      onClickBack?.()
    }
  }, [isOpen, onClickBack])

  return (
    <DialogContentInner
      {...rest}
      isOpen={isOpen}
      ariaLabelledby={heading.id}
      className={className}
      onPressEscape={closeButton.disabled ? undefined : onPressEscape}
      focusTrapRef={focusTrapRef}
    >
      <StepFormDialogContentInner
        heading={heading}
        activeStep={activeStep}
        contentBgColor={contentBgColor}
        contentPadding={contentPadding}
        firstStep={firstStep}
        stepLength={stepLength}
        submitButton={submitButton}
        closeButton={closeButton}
        backButton={backButton}
        onClickClose={actualOnClickClose}
        onSubmit={onDelegateSubmit}
        onClickBack={actualOnClickBack}
        responseStatus={responseStatus}
      >
        {children}
      </StepFormDialogContentInner>
    </DialogContentInner>
  )
}
