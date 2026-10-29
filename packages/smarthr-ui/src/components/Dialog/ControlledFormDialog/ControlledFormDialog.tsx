import {
  type ComponentPropsWithRef,
  type FC,
  type FormEvent,
  type MouseEvent,
  type ReactNode,
  useMemo,
} from 'react'

import { useLatest } from '../../../hooks/useLatest'
import { useObjectAttributes } from '../../../hooks/useObjectAttributes'
import { DialogContent, DialogPortal } from '../client'
import { useObjectHeading } from '../useObjectHeading'

import { FormDialogContent } from './FormDialogContent'

import type { ExtendElementPropsWithRef, ExtendProps } from '../../../types'
import type { DialogProps } from '../types'

type FormDialogContentProps = ComponentPropsWithRef<typeof FormDialogContent>
type ObjectHeadingType = Omit<FormDialogContentProps['heading'], 'id'>
type HeadingType = ReactNode | ObjectHeadingType
type ObjectActionButtonType = FormDialogContentProps['actionButton']
type ObjectCloseButtonType = FormDialogContentProps['closeButton']

type Props = ExtendElementPropsWithRef<
  typeof DialogContent,
  ExtendProps<
    FormDialogContentProps,
    DialogProps & {
      heading: HeadingType
      actionButton: ReactNode | ObjectActionButtonType
      closeButton?: ReactNode | ObjectCloseButtonType
      /**
       * フォーム送信時に発火するコールバック関数
       */
      onSubmit: (e: FormEvent<HTMLFormElement>, helpers: { close: () => void }) => void
      /**
       * 閉じるボタンをクリックした時に発火するコールバック関数
       */
      onClickClose: (e?: MouseEvent<HTMLButtonElement> | KeyboardEvent) => void
    },
    { omit: 'handleClickClose' | 'handleSubmit' }
  >,
  { omit: 'focusTrapRef' }
>

const headingObjectConverter = (text: ReactNode) => ({
  text,
})
const buttonObjectConverter = (text: ReactNode) => ({ text })

export const ControlledFormDialog: FC<Props> = ({
  children,
  heading: orgHeading,
  contentBgColor,
  contentPadding,
  actionButton: orgActionButton,
  onSubmit,
  onClickClose,
  onPressEscape = onClickClose,
  responseStatus,
  closeButton: orgCloseButton,
  subActionArea,
  className,
  portalParent,
  id,
  isOpen,
  ...rest
}) => {
  const heading = useObjectHeading<HeadingType, ObjectHeadingType>(
    orgHeading,
    headingObjectConverter,
  )
  const actionButton = useObjectAttributes<
    ReactNode | ObjectActionButtonType,
    ObjectActionButtonType
  >(orgActionButton, buttonObjectConverter)
  const closeButton = useObjectAttributes<ReactNode | ObjectCloseButtonType, ObjectCloseButtonType>(
    orgCloseButton,
    buttonObjectConverter,
  )

  const latest = useLatest({ onClickClose, onSubmit, isOpen })

  const functions = useMemo(() => {
    const handleClickClose = (e?: MouseEvent<HTMLButtonElement>) => {
      if (latest.isOpen) {
        latest.onClickClose(e)
      }
    }

    return {
      handleClickClose,
      handleSubmit: (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        // HINT: React Portals などで擬似的にformがネストしている場合など、stopPropagationを実行しないと
        // 親formが意図せずsubmitされてしまう場合がある
        e.stopPropagation()
        if (latest.isOpen) {
          latest.onSubmit(e, { close: handleClickClose })
        }
      },
    }
  }, [latest])

  return (
    <DialogPortal id={id} parent={portalParent}>
      <DialogContent
        {...rest}
        isOpen={isOpen}
        className={className}
        ariaLabelledby={heading.id}
        onPressEscape={closeButton.disabled ? undefined : onPressEscape}
      >
        <FormDialogContent
          contentBgColor={contentBgColor}
          contentPadding={contentPadding}
          responseStatus={responseStatus}
          handleClickClose={functions.handleClickClose}
          handleSubmit={functions.handleSubmit}
          heading={heading}
          actionButton={actionButton}
          closeButton={closeButton}
          subActionArea={subActionArea}
        >
          {children}
        </FormDialogContent>
      </DialogContent>
    </DialogPortal>
  )
}
