import {
  type ComponentPropsWithRef,
  type ComponentPropsWithoutRef,
  type FC,
  type FormEvent,
  type MouseEvent,
  type ReactNode,
  type SubmitEvent,
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
       *
       * `formProps.action` を渡していない場合は `preventDefault` された状態で呼ばれます。
       * 渡している場合は `preventDefault` されていない状態で呼ばれ、この中で `preventDefault` すると action は実行されません。
       */
      onSubmit?: (e: FormEvent<HTMLFormElement>, helpers: { close: () => void }) => void
      /**
       * form要素に渡す属性
       *
       * `action` を渡すと送信時に `preventDefault` されず、React の form action として実行されます。
       * `action` に URL を渡した場合は、ブラウザ標準のフォーム送信としてページ遷移します。
       * `formProps.onSubmit` は `onSubmit` より先に呼ばれ、この中で `preventDefault` すると
       * `onSubmit` と action はどちらも実行されません。
       * ダイアログを閉じている間（閉じるアニメーション中）も `formProps.onSubmit` は呼ばれますが、
       * `onSubmit` と action は実行されません。
       *
       * action 完了後に React が非制御の入力要素をリセットするため、ダイアログを開いたままにする場合は
       * `defaultValue` などで入力値を復元してください。
       * RemoteDialogTrigger 経由の FormDialog には action 完了後に閉じる手段がないため、
       * 閉じる必要がある場合は `isOpen` を制御できる ControlledFormDialog を使ってください。
       */
      formProps?: Omit<ComponentPropsWithoutRef<'form'>, 'children' | 'className'>
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
  formProps,
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

  const latest = useLatest({ onClickClose, onSubmit, formProps, isOpen })

  const functions = useMemo(() => {
    const handleClickClose = (e?: MouseEvent<HTMLButtonElement>) => {
      if (latest.isOpen) {
        latest.onClickClose(e)
      }
    }

    return {
      handleClickClose,
      handleSubmit: (e: SubmitEvent<HTMLFormElement>) => {
        // HINT: React Portals などで擬似的にformがネストしている場合など、stopPropagationを実行しないと
        // 親formが意図せずsubmitされてしまう場合がある。また親formのonSubmitがpreventDefaultすると、
        // このformのactionも実行されなくなるため、actionの有無に関わらず実行する
        e.stopPropagation()

        // HINT: conformのresetなどはsubmitイベント経由で状態を更新するため、閉じるtransition中でも
        // formProps.onSubmitは呼ぶ必要がある。onSubmitとactionは閉じている間は実行しない
        latest.formProps?.onSubmit?.(e)

        if (e.defaultPrevented) {
          return
        }

        if (!latest.isOpen) {
          e.preventDefault()

          return
        }

        // HINT: ReactはsubmitイベントがdefaultPreventedかどうかでactionを実行するか判定するため、
        // actionがある場合はpreventDefaultしない
        if (!latest.formProps?.action) {
          e.preventDefault()
        }

        latest.onSubmit?.(e, { close: handleClickClose })
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
          formProps={formProps}
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
