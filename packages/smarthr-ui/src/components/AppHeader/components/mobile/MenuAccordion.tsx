import {
  type Dispatch,
  type FC,
  type PropsWithChildren,
  type ReactNode,
  memo,
  useCallback,
  useId,
  useMemo,
} from 'react'

import { useIntl } from '../../../../intl'
import { Button } from '../../../Button'
import { Heading } from '../../../Heading'
import { FaCaretDownIcon, FaCaretUpIcon } from '../../../Icon'
import { Cluster } from '../../../Layout'
import { Section } from '../../../SectioningContent'
import { Translate } from '../common/Translate'

type Props = PropsWithChildren<{
  isOpen: boolean
  setIsOpen: Dispatch<(isOpen: boolean) => boolean>
  title: ReactNode
}>

export const MenuAccordion: FC<Props> = ({ title, children, ...rest }) =>
  title ? (
    <ActualMenuAccordion {...rest} title={title}>
      {children}
    </ActualMenuAccordion>
  ) : (
    children
  )

const ActualMenuAccordion: FC<Props> = ({ isOpen, children, ...rest }) => {
  const id = useId()

  return (
    <Section>
      <AccordionHeading {...rest} isOpen={isOpen} id={id} />
      <div id={id}>{isOpen && <div className="shr-mt-0.5">{children}</div>}</div>
    </Section>
  )
}

const AccordionHeading = memo<Omit<Props, 'children'> & { id: string }>(
  ({ isOpen, setIsOpen, title, id }) => {
    const onClickButton = useCallback(() => setIsOpen((prev) => !prev), [setIsOpen])

    const { localize } = useIntl()
    const translated = useMemo(
      () => ({
        close: localize({
          id: 'smarthr-ui/AppHeader/MobileHeader/closeMenuAccordion',
          defaultText: '閉じる',
        }),
        open: localize({
          id: 'smarthr-ui/AppHeader/MobileHeader/openMenuAccordion',
          defaultText: '開く',
        }),
      }),
      [localize],
    )

    return (
      <Cluster justify="space-between" align="center">
        <Heading type="subSubBlockTitle">
          <Translate>{title}</Translate>
        </Heading>

        <Button
          size="s"
          aria-expanded={isOpen}
          aria-controls={id}
          className="[&&]:shr-min-h-0 [&&]:shr-p-0.25"
          onClick={onClickButton}
        >
          {isOpen ? (
            <FaCaretUpIcon aria-hidden={true} alt={translated.close} />
          ) : (
            <FaCaretDownIcon aria-hidden={true} alt={translated.open} />
          )}
        </Button>
      </Cluster>
    )
  },
)
