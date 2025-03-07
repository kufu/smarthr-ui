import React, { Dispatch, FC, PropsWithChildren, ReactNode, useId } from 'react'

import { Button } from '../../../Button'
import { Heading } from '../../../Heading'
import { FaCaretDownIcon, FaCaretUpIcon } from '../../../Icon'
import { Cluster } from '../../../Layout'
import { Section } from '../../../SectioningContent'
import { useIntl } from '../../../..'

type Props = {
  isOpen: boolean
  setIsOpen: Dispatch<(isOpen: boolean) => boolean>
  title: ReactNode
}

export const MenuAccordion: FC<PropsWithChildren<Props>> = ({
  isOpen,
  setIsOpen,
  title,
  children,
}) => {
  const { localize } = useIntl()
  const id = useId()

  if (!title) {
    return <div>{children}</div>
  }

  return (
    <Section>
      <Cluster justify="space-between" align="center">
        <Heading type="subSubBlockTitle">{title}</Heading>

        <Button
          size="s"
          aria-expanded={isOpen}
          aria-controls={id}
          className="[&&]:shr-p-0.25 [&&]:shr-min-h-0"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {isOpen ? (
            <FaCaretUpIcon
              role="img"
              aria-label={localize({ id: 'smarthr-ui/AppHeader/menuClose', defaultText: '閉じる' })}
            />
          ) : (
            <FaCaretDownIcon
              role="img"
              aria-label={localize({ id: 'smarthr-ui/AppHeader/menuOpen', defaultText: '開く' })}
            />
          )}
        </Button>
      </Cluster>

      <div id={id}>{isOpen && <div className="shr-mt-0.5">{children}</div>}</div>
    </Section>
  )
}
