'use client'

import { type FC, type PropsWithChildren, type ReactNode, memo, useCallback, useMemo } from 'react'

import { type DecoratorsType, useDecorators } from '../../../hooks/useDecorators'
import { type ResponseStatus, useResponseStatus } from '../../../hooks/useResponseStatus'
import { useIntl } from '../../../intl'
import { Button } from '../../Button'
import { Cluster, Stack } from '../../Layout'
import { Section } from '../../SectioningContent'
import { DialogBody, type Props as DialogBodyProps } from '../DialogBody'
import { DialogContentResponseStatusMessage } from '../DialogContentResponseStatusMessage'
import { DialogHeading, type Props as DialogHeadingProps } from '../DialogHeading'
import { dialogContentInner } from '../dialogInnerStyle'

export type AbstractProps = PropsWithChildren<
  DialogBodyProps & {
    /** ダイアログタイトル */
    heading: DialogHeadingProps
    /** アクションボタンのラベル */
    actionText: ReactNode
    /** アクションボタンのスタイル */
    actionTheme?: 'primary' | 'secondary' | 'danger'
    /**
     * アクションボタンをクリックした時に発火するコールバック関数
     * @param closeDialog - ダイアログを閉じる関数
     */
    onClickAction: (closeDialog: () => void) => void
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

export type ActionDialogContentInnerProps = AbstractProps & {
  onClickClose: () => void
  responseStatus?: ResponseStatus
}

const ACTION_AREA_CLUSTER_GAP = { row: 0.5, column: 1 } as const

export const ActionDialogContentInner: FC<ActionDialogContentInnerProps> = ({
  children,
  heading,
  contentBgColor,
  contentPadding,
  actionText,
  actionTheme,
  onClickAction,
  onClickClose,
  responseStatus,
  actionDisabled,
  closeDisabled,
  subActionArea,
  decorators,
}) => {
  const calcedResponseStatus = useResponseStatus(responseStatus)

  const styles = useMemo(() => {
    const { wrapper, actionArea, buttonArea, message } = dialogContentInner()

    return {
      wrapper: wrapper(),
      actionArea: actionArea(),
      buttonArea: buttonArea(),
      message: message(),
    }
  }, [])

  return (
    <Section className={styles.wrapper}>
      <DialogHeading {...heading} />
      <DialogBody contentPadding={contentPadding} contentBgColor={contentBgColor}>
        {children}
      </DialogBody>
      <Stack gap={0.5} className={styles.actionArea}>
        <Cluster justify="space-between">
          {subActionArea}
          <ActionAreaCluster
            onClickClose={onClickClose}
            onClickAction={onClickAction}
            closeDisabled={closeDisabled}
            actionDisabled={actionDisabled}
            loading={calcedResponseStatus.isProcessing}
            actionTheme={actionTheme}
            decorators={decorators}
            actionText={actionText}
            className={styles.buttonArea}
          />
        </Cluster>
        <DialogContentResponseStatusMessage
          responseStatus={calcedResponseStatus}
          className={styles.message}
        />
      </Stack>
    </Section>
  )
}

const ActionAreaCluster = memo<
  Pick<
    ActionDialogContentInnerProps,
    | 'onClickClose'
    | 'onClickAction'
    | 'closeDisabled'
    | 'actionDisabled'
    | 'actionTheme'
    | 'decorators'
    | 'actionText'
  > & { loading: boolean; className: string }
>(
  ({
    onClickClose,
    onClickAction,
    closeDisabled,
    actionDisabled,
    loading,
    actionTheme,
    decorators,
    actionText,
    className,
  }) => {
    const handleClickAction = useCallback(() => {
      onClickAction(onClickClose)
    }, [onClickAction, onClickClose])

    return (
      <Cluster gap={ACTION_AREA_CLUSTER_GAP} className={className}>
        <CloseButton
          onClick={onClickClose}
          disabled={closeDisabled || loading}
          decorators={decorators}
        />
        <ActionButton
          variant={actionTheme}
          disabled={actionDisabled}
          loading={loading}
          onClick={handleClickAction}
        >
          {actionText}
        </ActionButton>
      </Cluster>
    )
  },
)

const ActionButton = memo<
  PropsWithChildren<{
    variant: ActionDialogContentInnerProps['actionTheme']
    disabled: ActionDialogContentInnerProps['actionDisabled']
    loading: boolean
    onClick: () => void
  }>
>(({ variant = 'primary', disabled, loading, onClick, children }) => (
  <Button
    type="submit"
    variant={variant}
    disabled={disabled}
    loading={loading}
    onClick={onClick}
    className="smarthr-ui-Dialog-actionButton"
  >
    {children}
  </Button>
))

const CloseButton = memo<
  Pick<ActionDialogContentInnerProps, 'decorators'> & {
    onClick: ActionDialogContentInnerProps['onClickClose']
    disabled: boolean
  }
>(({ onClick, disabled, decorators }) => {
  const { localize } = useIntl()

  const decoratorDefaultTexts = useMemo(
    () => ({
      closeButtonLabel: localize({
        id: 'smarthr-ui/ActionDialog/closeButtonLabel',
        defaultText: 'キャンセル',
      }),
    }),
    [localize],
  )

  const decorated = useDecorators(decoratorDefaultTexts, decorators)

  return (
    <Button onClick={onClick} disabled={disabled} className="smarthr-ui-Dialog-closeButton">
      {decorated.closeButtonLabel}
    </Button>
  )
})
