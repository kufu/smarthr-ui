import React, { ComponentProps, FormEvent, useCallback, useId } from 'react'

import { DialogContentInner } from '../DialogContentInner'
import { DialogProps } from '../types'
import { useDialogPortal } from '../useDialogPortal'
import { useStepDialog } from '../useStepDialog'

import { FormDialogContentInner, FormDialogContentInnerProps } from './FormDialogContentInner'

type Props = Omit<FormDialogContentInnerProps, 'titleId' | 'onSubmit'> &
  DialogProps & {
    /**
     * アクションボタンをクリックした時に発火するコールバック関数
     * @param closeDialog ダイアログを閉じる関数
     * @param activeStep hasStep:true の場合のみ、次のページ数
     */
    onSubmit: (closeDialog: () => void, e: FormEvent<HTMLFormElement>, activeStep?: number) => void
    /** Stepつきダイアログか否か */
    hasStep?: boolean
  }
type ElementProps = Omit<ComponentProps<'div'>, keyof Props>

export const FormDialog: React.FC<Props & ElementProps> = ({
  children,
  title,
  subtitle,
  titleTag,
  contentBgColor,
  contentPadding,
  actionText,
  actionTheme,
  onSubmit,
  onClickClose,
  onPressEscape = onClickClose,
  responseMessage,
  actionDisabled = false,
  closeDisabled,
  subActionArea,
  className,
  portalParent,
  decorators,
  id,
  hasStep,
  ...props
}) => {
  const { createPortal } = useDialogPortal(portalParent, id)
  const titleId = useId()
  const {
    titleSuffix,
    focusTrapRef,
    childrenSteps,
    activeStep,
    getActionText,
    handleNextSteps,
    renderSubActionButton,
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

      if (hasStep) {
        handleNextSteps()
      }

      onSubmit(close, e, activeStep)
    },
    [onSubmit, props.isOpen, hasStep, handleNextSteps, activeStep],
  )

  return createPortal(
    <DialogContentInner
      {...props}
      ariaLabelledby={titleId}
      className={className}
      onPressEscape={onPressEscape}
      focusTrapRef={focusTrapRef}
    >
      {/* eslint-disable-next-line smarthr/a11y-delegate-element-has-role-presentation */}
      <FormDialogContentInner
        title={hasStep ? `${title}${titleSuffix}` : title}
        titleId={titleId}
        subtitle={subtitle}
        titleTag={titleTag}
        contentBgColor={contentBgColor}
        contentPadding={contentPadding}
        actionText={hasStep ? getActionText(actionText, decorators?.nextButtonLabel) : actionText}
        actionTheme={actionTheme}
        actionDisabled={actionDisabled}
        closeDisabled={closeDisabled}
        subActionArea={hasStep ? renderSubActionButton() : subActionArea}
        onClickClose={handleClickClose}
        onSubmit={handleSubmitAction}
        responseMessage={responseMessage}
        decorators={decorators}
      >
        {hasStep ? childrenSteps[activeStep] : children}
      </FormDialogContentInner>
    </DialogContentInner>,
  )
}
