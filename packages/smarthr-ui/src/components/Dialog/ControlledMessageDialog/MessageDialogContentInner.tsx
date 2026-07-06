import { type FC, type ReactNode, memo, useMemo } from 'react'

import { useEnvironment } from '../../../hooks/useEnvironment'
import { Localizer } from '../../../intl'
import { Button } from '../../Button'
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
}) => {
  const { mobile } = useEnvironment()

  const styles = useMemo(() => {
    const { wrapper, actionArea } = dialogContentInner({ mobile })

    return {
      wrapper: wrapper(),
      actionArea: actionArea(),
    }
  }, [mobile])

  return (
    <Section className={styles.wrapper}>
      <DialogHeader>
        <DialogHeading {...heading} />
      </DialogHeader>
      <DialogBody contentPadding={contentPadding} contentBgColor={contentBgColor}>
        {children}
      </DialogBody>
      <FooterCluster
        handleClickClose={handleClickClose}
        closeButton={closeButton}
        className={styles.actionArea}
      />
    </Section>
  )
}

const FooterCluster = memo<
  Pick<MessageDialogContentInnerProps, 'handleClickClose' | 'closeButton'> & { className: string }
>(({ handleClickClose, closeButton, className }) => (
  <Cluster as="footer" justify="flex-end" className={className}>
    <Button className="smarthr-ui-Dialog-closeButton" onClick={handleClickClose}>
      {closeButton ?? (
        <Localizer id="smarthr-ui/MessageDialog/closeButtonLabel" defaultText="閉じる" />
      )}
    </Button>
  </Cluster>
))
