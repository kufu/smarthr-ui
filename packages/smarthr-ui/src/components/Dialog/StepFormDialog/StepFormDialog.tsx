import React, { ComponentProps, FormEvent, useCallback, useId } from 'react'

import { DialogContentInner } from '../DialogContentInner'
import { DialogProps } from '../types'
import { useDialogPortal } from '../useDialogPortal'

import {
  StepFormDialogContentInner,
  StepFormDialogContentInnerProps,
} from './StepFormDialogContentInner'
import { useStepDialog } from './useStep'

type Props = Omit<StepFormDialogContentInnerProps, 'titleId' | 'activeStep' | 'stepLength'> &
  DialogProps
type ElementProps = Omit<ComponentProps<'div'>, keyof Props>

export const StepFormDialog: React.FC<Props & ElementProps> = ({
  children,
  title,
  subtitle,
  titleTag,
  contentBgColor,
  contentPadding,
  actionTheme,
  submitLabel,
  onSubmit,
  onClickClose,
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
  const {
    activeStep,
    childrenSteps,
    onSubmit: onSubmitStep,
    onBackSteps,
    onNextSteps,
    focusTrapRef,
  } = useStepDialog(children)

  const handleClickClose = useCallback(() => {
    if (!props.isOpen) {
      return
    }
    onClickClose()
  }, [onClickClose, props.isOpen])

  const handleSubmitAction = useCallback(
    (close: () => void, e: FormEvent<HTMLFormElement>) => {
      if (!props.isOpen) {
        return
      }

      onSubmitStep()
      onSubmit(close, e)
    },
    [onSubmit, onSubmitStep, props.isOpen],
  )
  const handleBackSteps = useCallback(() => {
    if (!props.isOpen) {
      return
    }
    onBackSteps()
  }, [props.isOpen, onBackSteps])

  const handleNextSteps = useCallback(() => {
    if (!props.isOpen) {
      return
    }
    onNextSteps()
  }, [props.isOpen, onNextSteps])

  return createPortal(
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
        activeStep={activeStep}
        stepLength={childrenSteps.length}
        actionTheme={actionTheme}
        actionDisabled={actionDisabled}
        closeDisabled={closeDisabled}
        submitLabel={submitLabel}
        onClickClose={handleClickClose}
        onSubmit={handleSubmitAction}
        onClickBack={handleBackSteps}
        onClickNext={handleNextSteps}
        responseMessage={responseMessage}
        decorators={decorators}
      >
        {childrenSteps[activeStep]}
      </StepFormDialogContentInner>
    </DialogContentInner>,
  )
}
