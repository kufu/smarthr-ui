import {
  type Dispatch,
  type FC,
  type PropsWithChildren,
  type ReactNode,
  memo,
  useCallback,
  useId,
} from 'react'

import { Localizer } from '../../../../intl'
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

    return (
      <Cluster justify="space-between" align="center">
        <Heading type="subSubBlockTitle">
          <Translate>{title}</Translate>
        </Heading>

        <Button
          size="S"
          aria-expanded={isOpen}
          aria-controls={id}
          className="[&&]:shr-min-h-0 [&&]:shr-p-0.25"
          onClick={onClickButton}
        >
          {isOpen ? (
            <FaCaretUpIcon
              alt={
                <Localizer
                  id="smarthr-ui/AppHeader/MobileHeader/closeMenuAccordion"
                  defaultText="閉じる"
                />
              }
            />
          ) : (
            <FaCaretDownIcon
              alt={
                <Localizer
                  id="smarthr-ui/AppHeader/MobileHeader/openMenuAccordion"
                  defaultText="開く"
                />
              }
            />
          )}
        </Button>
      </Cluster>
    )
  },
)
