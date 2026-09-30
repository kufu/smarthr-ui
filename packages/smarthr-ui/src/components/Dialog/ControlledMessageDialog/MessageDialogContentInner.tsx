import { type ComponentProps, type FC, type ReactNode, memo } from 'react'

import { Localizer } from '../../../intl'
import { Button } from '../../Button'
import { Cluster } from '../../Layout'
import { Section } from '../../SectioningContent'
import { DialogBody } from '../DialogBody'
import { DialogHeading } from '../DialogHeading'
import { dialogContentInner } from '../dialogInnerStyle'

type Props = ComponentProps<typeof DialogBody> & {
  /** ダイアログタイトル */
  heading: ComponentProps<typeof DialogHeading>
  /** ダイアログの説明 */
  children: ReactNode
  /** 閉じるボタン */
  closeButton?: ReactNode
  handleClickClose: () => void
}

const CLASS_NAMES = (() => {
  const { wrapper, actionArea } = dialogContentInner()

  return {
    wrapper: wrapper(),
    actionArea: actionArea(),
  }
})()

export const MessageDialogContentInner: FC<Props> = ({
  heading,
  contentBgColor,
  contentPadding,
  children,
  handleClickClose,
  closeButton,
}) => (
  <Section className={CLASS_NAMES.wrapper}>
    <DialogHeading {...heading} />
    <DialogBody contentPadding={contentPadding} contentBgColor={contentBgColor}>
      {children}
    </DialogBody>
    <FooterCluster handleClickClose={handleClickClose} closeButton={closeButton} />
  </Section>
)

const FooterCluster = memo<Pick<Props, 'handleClickClose' | 'closeButton'>>(
  ({ handleClickClose, closeButton }) => (
    <Cluster as="footer" justify="flex-end" className={CLASS_NAMES.actionArea}>
      <Button className="smarthr-ui-Dialog-closeButton" onClick={handleClickClose}>
        {closeButton ?? (
          <Localizer id="smarthr-ui/MessageDialog/closeButtonLabel" defaultText="閉じる" />
        )}
      </Button>
    </Cluster>
  ),
)
