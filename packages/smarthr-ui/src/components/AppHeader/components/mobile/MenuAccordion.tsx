import React, { Dispatch, FC, PropsWithChildren, ReactNode, useId } from 'react'

import { Button } from '../../../Button'
import { Heading } from '../../../Heading'
import { FaCaretDownIcon, FaCaretUpIcon } from '../../../Icon'
import { Cluster } from '../../../Layout'
import { Section } from '../../../SectioningContent'
import { useTranslate } from '../../hooks/useTranslate'
import { Translate } from '../common/Translate'

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
  const translate = useTranslate()
  const id = useId()

  if (!title) {
    return children
  }

  return (
    <Section>
      <Cluster justify="space-between" align="center">
        <Heading type="subSubBlockTitle">
          <Translate>{title}</Translate>
        </Heading>

        <Button
          size="s"
          aria-expanded={isOpen}
          aria-controls={id}
          className="[&&]:shr-p-0.25 [&&]:shr-min-h-0"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {isOpen ? (
            <FaCaretUpIcon role="img" aria-label={translate('MobileHeader/MenuAccordion/close')} />
          ) : (
            <FaCaretDownIcon role="img" aria-label={translate('MobileHeader/MenuAccordion/open')} />
          )}
        </Button>
      </Cluster>

      <div id={id}>{isOpen && <div className="shr-mt-0.5">{children}</div>}</div>
    </Section>
  )
}
