import { type FC, type ReactNode, memo, useMemo } from 'react'

import { type DecoratorsType, useDecorators } from '../../../hooks/useDecorators'
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
  /** コンポーネント内の文言を変更するための関数を設定 */
  decorators?: DecoratorsType<'closeButtonLabel'>
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
    <Section className={styles.wrapper}>
      <DialogHeading {...heading} />
      <DialogBody contentPadding={contentPadding} contentBgColor={contentBgColor}>
        {children}
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
  const { localize } = useIntl()

  const decoratorDefaultTexts = useMemo(
    () => ({
      closeButtonLabel: localize({
        id: 'smarthr-ui/MessageDialog/closeButtonLabel',
        defaultText: '閉じる',
      }),
    }),
    [localize],
  )

  const decorated = useDecorators<'closeButtonLabel'>(decoratorDefaultTexts, decorators)

  return (
    <Cluster as="footer" justify="flex-end" className={className}>
      <Button onClick={onClickClose} className="smarthr-ui-Dialog-closeButton">
        {decorated.closeButtonLabel}
      </Button>
    </Cluster>
  )
})
