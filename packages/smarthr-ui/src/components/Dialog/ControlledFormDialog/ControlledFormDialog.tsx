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
       *
       * `action` と送信ボタンの `formAction` のどちらも無い場合は `preventDefault` された状態で呼ばれ、
       * ダイアログを閉じている間（閉じるアニメーション中）は呼ばれません。
       *
       * どちらかがある場合は `preventDefault` されていない状態で呼ばれ、この中で `preventDefault` すると
       * action は実行されません。また、ダイアログを閉じている間も呼ばれますが、その場合 action は実行されません。
       */
      onSubmit?: (e: FormEvent<HTMLFormElement>, helpers: { close: () => void }) => void
      /**
       * form要素の action 属性
       *
       * 関数を渡すと送信時に `preventDefault` されず、React の form action として実行されます。
       * URL を渡した場合は、ブラウザ標準のフォーム送信としてページ遷移します。
       * children 内の送信ボタンに `formAction` を渡した場合も同様に、その action が実行されます。
       *
       * action 完了後に React が非制御の入力要素をリセットするため、ダイアログを開いたままにする場合は
       * `defaultValue` などで入力値を復元してください。
       * RemoteDialogTrigger 経由の FormDialog には action 完了後に閉じる手段がないため、
       * 閉じる必要がある場合は `isOpen` を制御できる ControlledFormDialog を使ってください。
       */
      action?: FormDialogContentProps['action']
      /**
       * form要素に渡す属性
       *
       * `onSubmit` と `action` はそれぞれ同名の props で指定してください。
       */
      formProps?: FormDialogContentProps['formProps']
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
  action,
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

  const latest = useLatest({ onClickClose, onSubmit, action, isOpen })

  const functions = useMemo(() => {
    const handleClickClose = (e?: MouseEvent<HTMLButtonElement>) => {
      if (latest.isOpen) {
        latest.onClickClose(e)
      }
    }

    const handleSubmit: FormDialogContentProps['handleSubmit'] = (e) => {
      // HINT: React Portals などで擬似的にformがネストしている場合など、stopPropagationを実行しないと
      // 親formが意図せずsubmitされてしまう場合がある。また親formのonSubmitがpreventDefaultすると、
      // このformのactionも実行されなくなるため、actionの有無に関わらず実行する
      e.stopPropagation()

      // HINT: ReactはsubmitイベントがdefaultPreventedかどうかでactionを実行するか判定するため、
      // form・送信ボタンのどちらかにactionがある場合はpreventDefaultしない。
      // ReactはformActionに関数を渡すとformaction属性も付与するため、属性の有無で判定できる
      // 空文字のactionは現在のURLへの送信を表すため、真偽値ではなくundefinedかどうかで判定する
      const hasAction =
        latest.action !== undefined || Boolean(e.nativeEvent.submitter?.hasAttribute('formaction'))

      if (!hasAction) {
        e.preventDefault()

        if (latest.isOpen) {
          latest.onSubmit?.(e, { close: handleClickClose })
        }

        return
      }

      // HINT: conformのresetなどはsubmitイベント経由で状態を更新するため、閉じるtransition中でも
      // onSubmitは呼ぶ必要がある。actionは閉じている間は実行しない
      latest.onSubmit?.(e, { close: handleClickClose })

      if (!latest.isOpen) {
        e.preventDefault()
      }
    }

    return {
      handleClickClose,
      handleSubmit,
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
          action={action}
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
