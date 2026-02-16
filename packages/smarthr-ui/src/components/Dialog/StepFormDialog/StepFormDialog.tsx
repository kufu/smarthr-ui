'use client'

import {
  type ComponentProps,
  type FC,
  type FormEvent,
  type ReactNode,
  useCallback,
  useRef,
} from 'react'

import { DialogContentInner } from '../DialogContentInner'
import { useDialogPortal } from '../useDialogPortal'
import { useObjectHeading } from '../useObjectHeading'

import {
  StepFormDialogContentInner,
  type StepFormDialogContentInnerProps,
} from './StepFormDialogContentInner'
import { StepFormDialogProvider, type StepItem } from './StepFormDialogProvider'

import type { FocusTrapRef } from '../FocusTrap'
import type { DialogProps /** コンテンツなにもないDialogの基本props */ } from '../types'

type ObjectHeadingType = Omit<StepFormDialogContentInnerProps['heading'], 'id'>
type HeadingType = ReactNode | ObjectHeadingType

type AbstractProps = Omit<StepFormDialogContentInnerProps, 'heading' | 'activeStep'> &
  DialogProps & {
    heading: HeadingType
  }
type Props = AbstractProps & Omit<ComponentProps<'div'>, keyof AbstractProps>

const headingObjectConverter = (text: ReactNode) => ({ text })

export const StepFormDialog: FC<Props> = ({
  children,
  heading: orgHeading,
  stepLength,
  contentBgColor,
  contentPadding,
  actionTheme,
  submitLabel,
  firstStep,
  onSubmit,
  onClickClose,
  onClickBack,
  onPressEscape = onClickClose,
  responseStatus,
  actionDisabled = false,
  closeDisabled,
  className,
  portalParent,
  decorators,
  id,
  isOpen,
  ...rest
}) => {
  const { createPortal } = useDialogPortal(portalParent, id)
  const heading = useObjectHeading<HeadingType, ObjectHeadingType>(
    orgHeading,
    headingObjectConverter,
  )

  const focusTrapRef = useRef<FocusTrapRef>(null)

  const actualOnClickClose = useCallback(() => {
    if (isOpen) {
      focusTrapRef.current?.focus()
      onClickClose()
    }
  }, [isOpen, onClickClose])

  const actualOnSubmitAction = useCallback(
    (close: () => void, e: FormEvent<HTMLFormElement>, currentStep: StepItem) => {
      if (isOpen) {
        focusTrapRef.current?.focus()

        return onSubmit(close, e, currentStep)
      }

      return undefined
    },
    [onSubmit, isOpen],
  )

  const actualOnClickBack = useCallback(() => {
    if (isOpen) {
      focusTrapRef.current?.focus()
      onClickBack?.()
    }
  }, [isOpen, onClickBack])

  return createPortal(
    <StepFormDialogProvider firstStep={firstStep}>
      <DialogContentInner
        {...rest}
        isOpen={isOpen}
        ariaLabelledby={heading.id}
        className={className}
        onPressEscape={closeDisabled ? undefined : onPressEscape}
        focusTrapRef={focusTrapRef}
      >
        {/* eslint-disable-next-line smarthr/a11y-delegate-element-has-role-presentation */}
        <StepFormDialogContentInner
          heading={heading}
          contentBgColor={contentBgColor}
          contentPadding={contentPadding}
          firstStep={firstStep}
          stepLength={stepLength}
          actionTheme={actionTheme}
          actionDisabled={actionDisabled}
          closeDisabled={closeDisabled}
          submitLabel={submitLabel}
          onClickClose={actualOnClickClose}
          onSubmit={actualOnSubmitAction}
          onClickBack={actualOnClickBack}
          responseStatus={responseStatus}
          decorators={decorators}
        >
          {children}
        </StepFormDialogContentInner>
      </DialogContentInner>
    </StepFormDialogProvider>,
  )
}
