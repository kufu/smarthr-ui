import { type FC, type ReactNode, memo, useMemo } from 'react'

import { useIntl } from '../../../intl'
import { Button } from '../../Button'
import { Cluster } from '../../Layout'
import { Section } from '../../SectioningContent'
import { DialogBody, type Props as DialogBodyProps } from '../DialogBody'
import { DialogHeading, type Props as DialogHeadingProps } from '../DialogHeading'
import { dialogContentInner } from '../dialogInnerStyle'

export type AbstractProps = DialogBodyProps & {
  /** ダイアログタイトル */
  heading: DialogHeadingProps
  /** ダイアログの説明 */
  children: ReactNode
  /** 閉じるボタン */
  closeButton?: ReactNode
}

export type MessageDialogContentInnerProps = AbstractProps & {
  onClickClose: () => void
}

export const MessageDialogContentInner: FC<MessageDialogContentInnerProps> = ({
  heading,
  contentBgColor,
  contentPadding,
  children,
  onClickClose,
  closeButton,
}) => {
  const styles = useMemo(() => {
    const { wrapper, actionArea } = dialogContentInner()

    return {
      wrapper: wrapper(),
      actionArea: actionArea(),
    }
  }, [])

  return (
    <Section className={styles.wrapper}>
      <DialogHeading {...heading} />
      <DialogBody contentPadding={contentPadding} contentBgColor={contentBgColor}>
        {children}
      </DialogBody>
      <FooterCluster
        onClickClose={onClickClose}
        closeButton={closeButton}
        className={styles.actionArea}
      />
    </Section>
  )
}

const FooterCluster = memo<
  Pick<MessageDialogContentInnerProps, 'onClickClose' | 'closeButton'> & { className: string }
>(({ onClickClose, closeButton, className }) => {
  const { localize } = useIntl()

  const defaultText = useMemo(
    () =>
      localize({
        id: 'smarthr-ui/MessageDialog/closeButtonLabel',
        defaultText: '閉じる',
      }),
    [localize],
  )

  return (
    <Cluster as="footer" justify="flex-end" className={className}>
      <Button onClick={onClickClose} className="smarthr-ui-Dialog-closeButton">
        {closeButton ?? defaultText}
      </Button>
    </Cluster>
  )
})
