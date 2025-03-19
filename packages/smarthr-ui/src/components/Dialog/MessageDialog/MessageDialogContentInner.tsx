import { type FC, type ReactNode, memo, useMemo } from 'react'

import { Button } from '../../Button'
import { Cluster } from '../../Layout'
import { Section } from '../../SectioningContent'
import { DialogBody, type Props as DialogBodyProps } from '../DialogBody'
import { DialogHeader, type Props as DialogHeaderProps } from '../DialogHeader'
import { dialogContentInner } from '../dialogInnerStyle'

import type { DecoratorsType } from '../../../hooks/useDecorators'

export type BaseProps = DialogHeaderProps &
  DialogBodyProps & {
    /** ダイアログの説明 */
    description: ReactNode
    /** コンポーネント内の文言を変更するための関数を設定 */
    decorators?: DecoratorsType<'closeButtonLabel'>
  }

export type MessageDialogContentInnerProps = BaseProps & {
  onClickClose: () => void
}

const CLOSE_BUTTON_LABEL = '閉じる'

export const MessageDialogContentInner: FC<MessageDialogContentInnerProps> = ({
  title,
  subtitle,
  titleTag,
  titleId,
  contentBgColor,
  contentPadding,
  description,
  onClickClose,
  decorators,
}) => {
  const styles = useMemo(() => {
    const { wrapper, actionArea } = dialogContentInner()

    return {
      wrapper: wrapper(),
      actionArea: actionArea(),
    }
  }, [])

  return (
    // eslint-disable-next-line smarthr/a11y-heading-in-sectioning-content
    <Section className={styles.wrapper}>
      <DialogHeader title={title} subtitle={subtitle} titleTag={titleTag} titleId={titleId} />
      <DialogBody contentPadding={contentPadding} contentBgColor={contentBgColor}>
        {description}
      </DialogBody>
      <FooterCluster
        onClickClose={onClickClose}
        decorators={decorators}
        className={styles.actionArea}
      />
    </Section>
  )
}

const FooterCluster = memo<
  Pick<MessageDialogContentInnerProps, 'onClickClose' | 'decorators'> & { className: string }
>(({ onClickClose, decorators, className }) => {
  const children = useMemo(
    () => decorators?.closeButtonLabel?.(CLOSE_BUTTON_LABEL) || CLOSE_BUTTON_LABEL,
    [decorators],
  )

  return (
    <Cluster as="footer" justify="flex-end" className={className}>
      <Button onClick={onClickClose} className="smarthr-ui-Dialog-closeButton">
        {children}
      </Button>
    </Cluster>
  )
})
