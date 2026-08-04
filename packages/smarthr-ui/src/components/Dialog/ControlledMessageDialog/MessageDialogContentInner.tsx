import { type FC, type ReactNode, memo } from 'react'

import { Localizer } from '../../../intl'
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

const CLASS_NAMES = (() => {
  const { wrapper, actionArea } = dialogContentInner()

  return {
    wrapper: wrapper(),
    actionArea: actionArea(),
  }
})()

export const MessageDialogContentInner: FC<MessageDialogContentInnerProps> = ({
  heading,
  contentBgColor,
  contentPadding,
  children,
  onClickClose,
  closeButton,
}) => (
  <Section className={CLASS_NAMES.wrapper}>
    <DialogHeading {...heading} />
    <DialogBody contentPadding={contentPadding} contentBgColor={contentBgColor}>
      {children}
    </DialogBody>
    <FooterCluster onClickClose={onClickClose} closeButton={closeButton} />
  </Section>
)

const FooterCluster = memo<Pick<MessageDialogContentInnerProps, 'onClickClose' | 'closeButton'>>(
  ({ onClickClose, closeButton }) => (
    <Cluster as="footer" justify="flex-end" className={CLASS_NAMES.actionArea}>
      <Button onClick={onClickClose} className="smarthr-ui-Dialog-closeButton">
        {closeButton ?? (
          <Localizer id="smarthr-ui/MessageDialog/closeButtonLabel" defaultText="閉じる" />
        )}
      </Button>
    </Cluster>
  ),
)
