import { type FC, type ReactNode, memo, useMemo } from 'react'

import { useEnvironment } from '../../../hooks/client/useEnvironment'
import { Localizer } from '../../../intl'
import { Button } from '../../Button'
import { FaXmarkIcon } from '../../Icon'
import { Cluster } from '../../Layout'
import { Section } from '../../SectioningContent'
import { DialogBody, type Props as DialogBodyProps } from '../DialogBody'
import { DialogHeader } from '../DialogHeader'
import { DialogHeading, type Props as DialogHeadingProps } from '../DialogHeading'
import { dialogContentInner } from '../dialogInnerStyle'

export type BaseProps = DialogBodyProps & {
  /** ダイアログタイトル */
  heading: DialogHeadingProps
  /** ダイアログの説明 */
  children: ReactNode
  /** 閉じるボタン */
  closeButton?: ReactNode
  /**
   * モバイル時の表示形式（'sheet' でボトムシート表示になり閉じるボタンがアイコン化する）
   */
  mobileType?: 'sheet'
}

export type MessageDialogContentInnerProps = BaseProps & {
  handleClickClose: () => void
}

export const MessageDialogContentInner: FC<MessageDialogContentInnerProps> = ({
  heading,
  contentBgColor,
  contentPadding,
  children,
  handleClickClose,
  closeButton,
  mobileType,
}) => {
  const { mobile } = useEnvironment()
  // mobile 環境でないときは mobileType='sheet' を無視してボトムシート化しない
  const actualMobileType = mobile ? mobileType : undefined
  const isSheet = actualMobileType === 'sheet'

  const classNames = useMemo(() => {
    const { wrapper, actionArea } = dialogContentInner()

    return {
      wrapper: wrapper({ mobileType: actualMobileType }),
      actionArea: actionArea({ mobile, mobileType: actualMobileType }),
    }
  }, [mobile, actualMobileType])

  return (
    <Section className={classNames.wrapper}>
      <DialogHeader mobileType={actualMobileType}>
        <DialogHeading {...heading} />
        {isSheet && (
          <CloseButton iconOnly handleClickClose={handleClickClose} closeButton={closeButton} />
        )}
      </DialogHeader>
      <DialogBody contentPadding={contentPadding} contentBgColor={contentBgColor}>
        {children}
      </DialogBody>
      {!isSheet && (
        <Cluster as="footer" justify="flex-end" className={classNames.actionArea}>
          <CloseButton handleClickClose={handleClickClose} closeButton={closeButton} />
        </Cluster>
      )}
    </Section>
  )
}

const CloseButton = memo<
  Pick<MessageDialogContentInnerProps, 'handleClickClose' | 'closeButton'> & { iconOnly?: boolean }
>(({ handleClickClose, closeButton, iconOnly }) => {
  const text = closeButton ?? (
    <Localizer id="smarthr-ui/MessageDialog/closeButtonLabel" defaultText="閉じる" />
  )

  return (
    <Button className="smarthr-ui-Dialog-closeButton" onClick={handleClickClose}>
      {iconOnly ? <FaXmarkIcon alt={text} /> : text}
    </Button>
  )
})
