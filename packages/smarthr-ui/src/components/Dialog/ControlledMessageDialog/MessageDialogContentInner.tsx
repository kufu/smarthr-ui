import { type FC, type ReactNode, memo, useMemo } from 'react'
import { tv } from 'tailwind-variants'

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

const messageDialogContentInner = tv({
  extend: dialogContentInner,
  slots: {
    header: '',
  },
  variants: {
    mobileType: {
      sheet: {
        header: 'shr-py-0.5',
      },
    },
  },
})

export const MessageDialogContentInner: FC<MessageDialogContentInnerProps> = ({
  heading,
  contentBgColor,
  contentPadding,
  children,
  handleClickClose,
  closeButton,
  mobileType,
  mobile,
}) => {
  const isSheet = mobileType === 'sheet'

  const classNames = useMemo(() => {
    const { wrapper, actionArea, header } = messageDialogContentInner()

    return {
      wrapper: wrapper({ mobileType }),
      actionArea: actionArea({ mobile, mobileType }),
      header: header({ mobileType }),
    }
  }, [mobileType, mobile])

  return (
    <Section className={classNames.wrapper}>
      <DialogHeader mobile={mobile} mobileType={mobileType} className={classNames.header}>
        <DialogHeading {...heading} />
        {isSheet && (
          <CloseButton iconOnly handleClickClose={handleClickClose} closeButton={closeButton} />
        )}
      </DialogHeader>
      <DialogBody mobile={mobile} contentPadding={contentPadding} contentBgColor={contentBgColor}>
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
