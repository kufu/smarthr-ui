'use client'

import { type ComponentProps, type FC, type FormEvent, useCallback, useId, useRef } from 'react'

import { DialogContentInner } from '../DialogContentInner'
import { useDialogPortal } from '../useDialogPortal'

import {
  StepFormDialogContentInner,
  type StepFormDialogContentInnerProps,
} from './StepFormDialogContentInner'
import { StepFormDialogProvider } from './StepFormDialogProvider'

import type { FocusTrapRef } from '../FocusTrap'
import type { DialogProps /** コンテンツなにもないDialogの基本props */ } from '../types'

type Props = Omit<StepFormDialogContentInnerProps, 'titleId' | 'activeStep'> & DialogProps

type ElementProps = Omit<ComponentProps<'div'>, keyof Props>

export const StepFormDialog: FC<Props & ElementProps> = ({
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
  responseStatus,
  actionDisabled = false,
  closeDisabled,
  className,
  portalParent,
  decorators,
  id,
  isOpen,
  ...props
}) => {
  const { createPortal } = useDialogPortal(portalParent, id)
  const titleId = useId()
  const focusTrapRef = useRef<FocusTrapRef>(null)

  const actualOnClickClose = useCallback(() => {
    if (isOpen) {
      focusTrapRef.current?.focus()
      onClickClose()
    }
  }, [isOpen, onClickClose])

  const actualOnSubmitAction = useCallback(
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

  return createPortal(
    <StepFormDialogProvider firstStep={firstStep}>
      <DialogContentInner
        {...props}
        isOpen={isOpen}
        ariaLabelledby={titleId}
        className={className}
        onPressEscape={closeDisabled ? undefined : onPressEscape}
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
