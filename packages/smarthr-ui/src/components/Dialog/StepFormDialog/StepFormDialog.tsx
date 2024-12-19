import React, { ComponentProps, FormEvent, useCallback, useId, useRef } from 'react'

import { DialogContentInner } from '../DialogContentInner'
import { FocusTrapRef } from '../FocusTrap'
import { DialogProps /** コンテンツなにもないDialogの基本props */ } from '../types'
import { useDialogPortal } from '../useDialogPortal'

import {
  StepFormDialogContentInner,
  StepFormDialogContentInnerProps,
} from './StepFormDialogContentInner'
import { StepFormDialogProvider, type StepItem } from './StepFormDialogProvider'

type Props = Omit<StepFormDialogContentInnerProps, 'titleId' | 'activeStep'> & DialogProps

type ElementProps = Omit<ComponentProps<'div'>, keyof Props>

export const StepFormDialog: React.FC<Props & ElementProps> = ({
  children,
  title,
  subtitle,
  stepLength,
  titleTag,
  contentBgColor,
  contentPadding,
  actionTheme,
  submitLabel,
  firstStep,
  onSubmit,
  onClickClose,
  onClickBack,
  onPressEscape = onClickClose,
  responseMessage,
  actionDisabled = false,
  closeDisabled,
  className,
  portalParent,
  decorators,
  id,
  ...props
}) => {
  const { createPortal } = useDialogPortal(portalParent, id)
  const titleId = useId()
  const focusTrapRef = useRef<FocusTrapRef>(null)

  const handleClickClose = useCallback(() => {
    if (!props.isOpen) {
      return
    }
    focusTrapRef.current?.focus()
    onClickClose()
  }, [onClickClose, props.isOpen])

  const handleSubmitAction = useCallback(
    (close: () => void, e: FormEvent<HTMLFormElement>, currentStep: StepItem) => {
      if (!props.isOpen) {
        return undefined
      }
      focusTrapRef.current?.focus()
      return onSubmit(close, e, currentStep)
    },
    [onSubmit, props.isOpen],
  )

  const handleBackSteps = useCallback(() => {
    if (!props.isOpen) {
      return
    }
    focusTrapRef.current?.focus()
    onClickBack?.()
  }, [props.isOpen, onClickBack])

  return createPortal(
    <StepFormDialogProvider firstStep={firstStep}>
      <DialogContentInner
        {...props}
        ariaLabelledby={titleId}
        className={className}
        onPressEscape={onPressEscape}
        focusTrapRef={focusTrapRef}
      >
        {/* eslint-disable-next-line smarthr/a11y-delegate-element-has-role-presentation */}
        <StepFormDialogContentInner
          title={title}
          titleId={titleId}
          subtitle={subtitle}
          titleTag={titleTag}
          contentBgColor={contentBgColor}
          contentPadding={contentPadding}
          firstStep={firstStep}
          stepLength={stepLength}
          actionTheme={actionTheme}
          actionDisabled={actionDisabled}
          closeDisabled={closeDisabled}
          submitLabel={submitLabel}
          onClickClose={handleClickClose}
          onSubmit={handleSubmitAction}
          onClickBack={handleBackSteps}
          responseMessage={responseMessage}
          decorators={decorators}
        >
          {children}
        </StepFormDialogContentInner>
      </DialogContentInner>
    </StepFormDialogProvider>,
  )
}
