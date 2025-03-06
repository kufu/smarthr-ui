import React, {
  type FC,
  type FormEvent,
  type PropsWithChildren,
  type ReactNode,
  useCallback,
  useMemo,
} from 'react'
import { tv } from 'tailwind-variants'

import { type DecoratorsType } from '../../../hooks/useDecorators'
import { type ResponseStatus, useResponseStatus } from '../../../hooks/useResponseStatus'
import { Button } from '../../Button'
import { Cluster, Stack } from '../../Layout'
import { ResponseMessage } from '../../ResponseMessage'
import { Section } from '../../SectioningContent'
import { DialogBody, Props as DialogBodyProps } from '../DialogBody'
import { DialogHeader, type Props as DialogHeaderProps } from '../DialogHeader'
import { dialogContentInner } from '../dialogInnerStyle'

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
      decorators?: DecoratorsType<'closeButtonLabel'>
    }
>

export type FormDialogContentInnerProps = BaseProps & {
  onClickClose: () => void
  responseStatus?: ResponseStatus
}

const CLOSE_BUTTON_LABEL = 'キャンセル'
const ACTION_AREA_CLUSTER_GAP = { row: 0.5, column: 1 } as const

const formDialogContentInner = tv({
  extend: dialogContentInner,
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
  responseStatus,
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

  const calculatedResponseStatus = useResponseStatus(responseStatus)

  const styles = useMemo(() => {
    const { form, wrapper, actionArea, buttonArea, message } = formDialogContentInner()

    return {
      form: form(),
      wrapper: wrapper(),
      actionArea: actionArea(),
      buttonArea: buttonArea(),
      message: message(),
    }
  }, [])

  return (
    // eslint-disable-next-line smarthr/a11y-heading-in-sectioning-content, smarthr/a11y-prohibit-sectioning-content-in-form
    <Section className={styles.wrapper}>
      <DialogHeader title={title} subtitle={subtitle} titleTag={titleTag} titleId={titleId} />
      <form onSubmit={handleSubmitAction} className={styles.form}>
        <DialogBody contentPadding={contentPadding} contentBgColor={contentBgColor}>
          {children}
        </DialogBody>
        <Stack gap={0.5} className={styles.actionArea}>
          <Cluster justify="space-between">
            {subActionArea}
            <ActionAreaCluster
              onClickClose={onClickClose}
              closeDisabled={closeDisabled}
              actionDisabled={actionDisabled}
              loading={calculatedResponseStatus.isProcessing}
              actionTheme={actionTheme}
              decorators={decorators}
              actionText={actionText}
              className={styles.buttonArea}
            />
          </Cluster>
          {calculatedResponseStatus.message && (
            <div className={styles.message}>
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

const ActionAreaCluster = React.memo<
  Pick<
    FormDialogContentInnerProps,
    | 'onClickClose'
    | 'closeDisabled'
    | 'actionDisabled'
    | 'actionTheme'
    | 'decorators'
    | 'actionText'
  > & { loading: boolean; className: string }
>(
  ({
    onClickClose,
    closeDisabled,
    actionDisabled,
    loading,
    actionTheme,
    decorators,
    actionText,
    className,
  }) => (
    <Cluster gap={ACTION_AREA_CLUSTER_GAP} className={className}>
      <CloseButton
        onClick={onClickClose}
        disabled={closeDisabled || loading}
        decorators={decorators}
      />
      <ActionButton variant={actionTheme} disabled={actionDisabled} loading={loading}>
        {actionText}
      </ActionButton>
    </Cluster>
  ),
)

const ActionButton = React.memo<
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

const CloseButton = React.memo<
  Pick<FormDialogContentInnerProps, 'decorators'> & {
    onClick: FormDialogContentInnerProps['onClickClose']
    disabled: boolean
  }
>(({ onClick, disabled, decorators }) => {
  const children = useMemo(
    () => decorators?.closeButtonLabel?.(CLOSE_BUTTON_LABEL) || CLOSE_BUTTON_LABEL,
    [decorators],
  )

  return (
    <Button onClick={onClick} disabled={disabled} className="smarthr-ui-Dialog-closeButton">
      {children}
    </Button>
  )
})
