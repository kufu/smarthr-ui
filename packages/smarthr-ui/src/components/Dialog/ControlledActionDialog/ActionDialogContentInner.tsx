'use client'

import {
  type FC,
  type MouseEvent,
  type PropsWithChildren,
  type ReactNode,
  memo,
  useCallback,
  useMemo,
} from 'react'

import { type ResponseStatus, useResponseStatus } from '../../../hooks/useResponseStatus'
import { Localizer } from '../../../intl'
import { Button } from '../../Button'
import { Cluster } from '../../Layout'
import { Section } from '../../SectioningContent'
import { DialogBody, type Props as DialogBodyProps } from '../DialogBody'
import { DialogContentResponseStatusMessage } from '../DialogContentResponseStatusMessage'
import { DialogHeader } from '../DialogHeader'
import { DialogHeading, type Props as DialogHeadingProps } from '../DialogHeading'
import { dialogContentInner } from '../dialogInnerStyle'

export type ActionDialogHelpers = {
  close: () => void
}

type SubActionAreaHelpers = {
  /**
   * モバイル時の表示形式（'sheet' でボトムシート表示になる）
   */
  mobileType?: 'sheet'
}

type ObjectActionButtonType = {
  /** アクションボタンのラベル */
  text: ReactNode
  /** アクションボタンのスタイル */
  theme?: 'primary' | 'secondary' | 'danger'
  /** アクションボタンを無効にするかどうか */
  disabled?: boolean
}

type ObjectCloseButtonType = {
  /** 閉じるボタンのラベル */
  text?: ReactNode
  /** 閉じるボタンを無効にするかどうか */
  disabled?: boolean
}

export type BaseProps = PropsWithChildren<
  DialogBodyProps & {
    /** ダイアログタイトル */
    heading: DialogHeadingProps
    /** アクションボタン */
    actionButton: ObjectActionButtonType
    /**
     * アクションボタンをクリックした時に発火するコールバック関数
     * @param e マウスイベント
     * @param helpers ダイアログ操作のためのヘルパー関数
     */
    handleClickAction: (e: MouseEvent<Element>, helpers: ActionDialogHelpers) => void
    /** 閉じるボタン */
    closeButton: ObjectCloseButtonType
    /** ダイアログフッターの左端操作領域 */
    subActionArea?: ReactNode | ((helpers: SubActionAreaHelpers) => ReactNode)
    /**
     * モバイル時の表示形式（'sheet' でボトムシート表示になる）
     */
    mobileType?: 'sheet'
  }
>

export type ActionDialogContentInnerProps = BaseProps & {
  handleClickClose: () => void
  responseStatus?: ResponseStatus
}

const ACTION_AREA_CLUSTER_GAP = { row: 0.5, column: 1 } as const

export const ActionDialogContentInner: FC<ActionDialogContentInnerProps> = ({
  children,
  heading,
  contentBgColor,
  contentPadding,
  actionButton,
  handleClickAction,
  handleClickClose,
  responseStatus,
  closeButton,
  subActionArea,
  mobileType,
  mobile,
}) => {
  const calcedResponseStatus = useResponseStatus(responseStatus)
  const actualSubActionArea =
    typeof subActionArea === 'function' ? subActionArea({ mobileType }) : subActionArea

  const classNames = useMemo(() => {
    const { wrapper, actionArea, actionAreaInner, buttonArea, message } = dialogContentInner()
    const commonAttrs = { mobileType }

    return {
      wrapper: wrapper(commonAttrs),
      actionArea: actionArea({ mobile, mobileType }),
      actionAreaInner: actionAreaInner(commonAttrs),
      buttonArea: buttonArea(commonAttrs),
      message: message(),
    }
  }, [mobileType, mobile])

  return (
    <Section className={classNames.wrapper}>
      <DialogHeader mobileType={mobileType}>
        <DialogHeading {...heading} />
      </DialogHeader>
      <DialogBody mobile={mobile} contentPadding={contentPadding} contentBgColor={contentBgColor}>
        {children}
      </DialogBody>
      <div className={classNames.actionArea}>
        <Cluster
          gap={ACTION_AREA_CLUSTER_GAP}
          justify="space-between"
          className={classNames.actionAreaInner}
        >
          {actualSubActionArea}
          <ActionAreaCluster
            loading={calcedResponseStatus.isProcessing}
            className={classNames.buttonArea}
            handleClickClose={handleClickClose}
            handleClickAction={handleClickAction}
            closeButton={closeButton}
            actionButton={actionButton}
          />
        </Cluster>
        <DialogContentResponseStatusMessage
          responseStatus={calcedResponseStatus}
          className={classNames.message}
        />
      </div>
    </Section>
  )
}

const ActionAreaCluster = memo<
  Pick<ActionDialogContentInnerProps, 'handleClickClose' | 'handleClickAction'> & {
    actionButton: ObjectActionButtonType
    closeButton: ObjectCloseButtonType
    loading: boolean
    className: string
  }
>(({ handleClickClose, handleClickAction, closeButton, actionButton, loading, className }) => {
  const handleClickActionWithHelpers = useCallback(
    (e: MouseEvent<Element>) => {
      handleClickAction(e, { close: handleClickClose })
    },
    [handleClickAction, handleClickClose],
  )

  return (
    <Cluster gap={ACTION_AREA_CLUSTER_GAP} className={className}>
      <CloseButton
        disabled={closeButton.disabled || loading}
        text={closeButton.text}
        handleClick={handleClickClose}
      />
      <ActionButton
        disabled={actionButton.disabled}
        loading={loading}
        variant={actionButton.theme}
        handleClick={handleClickActionWithHelpers}
      >
        {actionButton.text}
      </ActionButton>
    </Cluster>
  )
})

const ActionButton = memo<
  PropsWithChildren<{
    variant: ObjectActionButtonType['theme']
    disabled: ObjectActionButtonType['disabled']
    loading: boolean
    handleClick: (e: MouseEvent<HTMLButtonElement>) => void
  }>
>(({ variant = 'primary', disabled, loading, handleClick, children }) => (
  <Button
    type="submit"
    disabled={disabled}
    loading={loading}
    variant={variant}
    className="smarthr-ui-Dialog-actionButton"
    onClick={handleClick}
  >
    {children}
  </Button>
))

const CloseButton = memo<{
  handleClick: ActionDialogContentInnerProps['handleClickClose']
  disabled: boolean
  text: ReactNode
}>(({ handleClick, disabled, text }) => (
  <Button disabled={disabled} className="smarthr-ui-Dialog-closeButton" onClick={handleClick}>
    {text ?? <Localizer id="smarthr-ui/ActionDialog/closeButtonLabel" defaultText="キャンセル" />}
  </Button>
))
