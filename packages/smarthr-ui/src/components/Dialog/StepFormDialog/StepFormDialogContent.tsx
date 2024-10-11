import React, { FormEvent, HTMLAttributes, useCallback, useContext, useId } from 'react'

import { DialogContentInner } from '../DialogContentInner'
import { DialogContext } from '../DialogWrapper'
import { UncontrolledDialogProps } from '../types'
import { useDialogPortal } from '../useDialogPortal'

import { BaseProps, StepFormDialogContentInner } from './StepFormDialogContentInner'
import { useStepDialog } from './useStep'

type Props = BaseProps & UncontrolledDialogProps
type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props>

export const StepFormDialogContent: React.FC<Props & ElementProps> = ({
  children,
  title,
  contentBgColor,
  contentPadding,
  submitLabel,
  actionTheme,
  onSubmit,
  actionDisabled = false,
  portalParent,
  className = '',
  decorators,
  ...props
}) => {
  const { activeStep, childrenSteps, onBackSteps, onNextSteps, focusTrapRef } =
    useStepDialog(children)
  const { onClickClose, active } = useContext(DialogContext)
  const { createPortal } = useDialogPortal(portalParent)

  const handleClickClose = useCallback(() => {
    if (!active) {
      return
    }
    onClickClose()
  }, [active, onClickClose])

  const handleSubmitAction = useCallback(
    (close: () => void, e: FormEvent<HTMLFormElement>) => {
      if (!active) {
        return
      }

      onSubmit(close, e)
    },
    [active, onSubmit],
  )

  const handleBackSteps = useCallback(() => {
    if (!active) {
      return
    }
    onBackSteps()
  }, [active, onBackSteps])

  const handleNextSteps = useCallback(() => {
    if (!active) {
      return
    }
    onNextSteps()
  }, [active, onNextSteps])

  const titleId = useId()

  return createPortal(
    <DialogContentInner
      {...props}
      onPressEscape={onClickClose}
      isOpen={active}
      ariaLabelledby={titleId}
      className={className}
      focusTrapRef={focusTrapRef}
    >
      {/* eslint-disable-next-line smarthr/a11y-delegate-element-has-role-presentation */}
      <StepFormDialogContentInner
        title={title}
        titleId={titleId}
        contentBgColor={contentBgColor}
        contentPadding={contentPadding}
        submitLabel={submitLabel}
        actionTheme={actionTheme}
        onSubmit={handleSubmitAction}
        onClickClose={handleClickClose}
        onClickBack={handleBackSteps}
        onClickNext={handleNextSteps}
        actionDisabled={actionDisabled}
        decorators={decorators}
        activeStep={activeStep}
        stepLength={childrenSteps.length}
      >
        {childrenSteps[activeStep]}
      </StepFormDialogContentInner>
    </DialogContentInner>,
  )
}
