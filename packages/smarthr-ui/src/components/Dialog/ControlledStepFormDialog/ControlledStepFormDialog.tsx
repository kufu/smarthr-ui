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
import { useIntl } from '../../../intl'
import { DialogContentInner } from '../DialogContentInner'
import { useDialogPortal } from '../useDialogPortal'
import { useObjectHeading } from '../useObjectHeading'

import {
  StepFormDialogContentInner,
  type AbstractProps as StepFormDialogContentInnerAbstractProps,
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

type DefaultTextsType = Record<
  'closeButtonLabel' | 'nextButtonLabel' | 'backButtonLabel',
  ReactNode
>

type AbstractProps = Omit<
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
    onSubmit: StepFormDialogContentInnerAbstractProps['handleSubmit']
    onClickClose: () => void
    onClickBack?: () => void
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
  const { localize } = useIntl()
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
        handleClickClose={functions.handleClickClose}
        handleSubmit={functions.handleSubmit}
        handleClickBack={functions.handleClickBack}
        responseStatus={responseStatus}
      >
        {children}
      </StepFormDialogContentInner>
    </DialogContentInner>
  )
}
