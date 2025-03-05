import React, {
  type FC,
  type FormEvent,
  type PropsWithChildren,
  type ReactNode,
  memo,
  useCallback,
  useMemo,
} from 'react'
import { tv } from 'tailwind-variants'

import { type DecoratorsType, useDecorators } from '../../../hooks/useDecorators'
import { type ResponseMessageType, useResponseMessage } from '../../../hooks/useResponseMessage'
import { Button } from '../../Button'
import { Cluster, Stack } from '../../Layout'
import { ResponseMessage } from '../../ResponseMessage'
import { Section } from '../../SectioningContent'
import { DialogBody, type Props as DialogBodyProps } from '../DialogBody'
import { DialogHeader, type Props as DialogHeaderProps } from '../DialogHeader'
import { innerClassNameGenerator } from '../innerClassNameGenerator'

export type BaseProps = PropsWithChildren<
  DialogHeaderProps &
    DialogBodyProps & {
      /** アクションボタンのラベル */
      actionText: ReactNode
      /** アクションボタンのスタイル */
      actionTheme?: 'primary' | 'secondary' | 'danger'
      /**
       * アクションボタンをクリックした時に発火するコールバック関数
       * @param closeDialog ダイアログを閉じる関数
       */
      onSubmit: (closeDialog: () => void, e: FormEvent<HTMLFormElement>) => void
      /** アクションボタンを無効にするかどうか */
      actionDisabled?: boolean
      /** 閉じるボタンを無効にするかどうか */
      closeDisabled?: boolean
      /** ダイアログフッターの左端操作領域 */
      subActionArea?: ReactNode
      /** コンポーネント内の文言を変更するための関数を設定 */
      decorators?: DecoratorsType<DecoratorKeyTypes>
    }
>

const DECORATOR_DEFAULT_TEXTS = {
  closeButtonLabel: 'キャンセル',
} as const
type DecoratorKeyTypes = keyof typeof DECORATOR_DEFAULT_TEXTS

export type FormDialogContentInnerProps = BaseProps & {
  onClickClose: () => void
  responseMessage?: ResponseMessageType
}

const ACTION_AREA_CLUSTER_GAP = { row: 0.5, column: 1 } as const

const classNameGenerator = tv({
  extend: innerClassNameGenerator,
  slots: {
    form: 'shr-contents',
  },
})

export const FormDialogContentInner: FC<FormDialogContentInnerProps> = ({
  children,
  title,
  titleId,
  subtitle,
  titleTag,
  contentBgColor,
  contentPadding,
  actionText,
  actionTheme,
  onSubmit,
  onClickClose,
  responseMessage,
  actionDisabled,
  closeDisabled,
  subActionArea,
  decorators,
}) => {
  const handleSubmitAction = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      // HINT: React Portals などで擬似的にformがネストしている場合など、stopPropagationを実行しないと
      // 親formが意図せずsubmitされてしまう場合がある
      e.stopPropagation()
      onSubmit(onClickClose, e)
    },
    [onSubmit, onClickClose],
  )

  const calculatedResponseStatus = useResponseMessage(responseMessage)

  const classNames = useMemo(() => {
    const { form, wrapper, actionArea, buttonArea, message } = classNameGenerator()

    return {
      form: form(),
      wrapper: wrapper(),
      actionArea: actionArea(),
      buttonArea: buttonArea(),
      message: message(),
    }
  }, [])

  const decorated = useDecorators<DecoratorKeyTypes>(DECORATOR_DEFAULT_TEXTS, decorators)

  return (
    // eslint-disable-next-line smarthr/a11y-heading-in-sectioning-content, smarthr/a11y-prohibit-sectioning-content-in-form
    <Section className={classNames.wrapper}>
      <DialogHeader title={title} subtitle={subtitle} titleTag={titleTag} titleId={titleId} />
      <form onSubmit={handleSubmitAction} className={classNames.form}>
        <DialogBody contentPadding={contentPadding} contentBgColor={contentBgColor}>
          {children}
        </DialogBody>
        <Stack gap={0.5} className={classNames.actionArea}>
          <Cluster justify="space-between">
            {subActionArea}
            <ActionAreaCluster
              onClickClose={onClickClose}
              closeDisabled={closeDisabled}
              actionDisabled={actionDisabled}
              loading={calculatedResponseStatus.isProcessing}
              actionTheme={actionTheme}
              actionText={actionText}
              closeButtonLabel={decorated.closeButtonLabel}
              className={classNames.buttonArea}
            />
          </Cluster>
          {calculatedResponseStatus.message && (
            <div className={classNames.message}>
              <ResponseMessage type={calculatedResponseStatus.status} role="alert">
                {calculatedResponseStatus.message}
              </ResponseMessage>
            </div>
          )}
        </Stack>
      </form>
    </Section>
  )
}

const ActionAreaCluster = memo<
  Pick<
    FormDialogContentInnerProps,
    'onClickClose' | 'closeDisabled' | 'actionDisabled' | 'actionTheme' | 'actionText'
  > & { loading: boolean; className: string; closeButtonLabel: ReactNode }
>(
  ({
    onClickClose,
    closeDisabled,
    actionDisabled,
    loading,
    actionTheme,
    actionText,
    closeButtonLabel,
    className,
  }) => (
    <Cluster gap={ACTION_AREA_CLUSTER_GAP} className={className}>
      <CloseButton onClick={onClickClose} disabled={closeDisabled || loading}>
        {closeButtonLabel}
      </CloseButton>
      <ActionButton variant={actionTheme} disabled={actionDisabled} loading={loading}>
        {actionText}
      </ActionButton>
    </Cluster>
  ),
)

const ActionButton = memo<
  PropsWithChildren<{
    variant: FormDialogContentInnerProps['actionTheme']
    disabled: FormDialogContentInnerProps['actionDisabled']
    loading: boolean
  }>
>(({ variant = 'primary', disabled, loading, children }) => (
  <Button
    type="submit"
    variant={variant}
    disabled={disabled}
    loading={loading}
    className="smarthr-ui-Dialog-actionButton"
  >
    {children}
  </Button>
))

const CloseButton = memo<
  PropsWithChildren<{
    onClick: FormDialogContentInnerProps['onClickClose']
    disabled: boolean
  }>
>(({ onClick, disabled, children }) => (
  <Button onClick={onClick} disabled={disabled} className="smarthr-ui-Dialog-closeButton">
    {children}
  </Button>
))
