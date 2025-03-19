import { Button } from '../../../Button'
import { Heading } from '../../../Heading'
import { FaArrowLeftIcon } from '../../../Icon'
import { useTranslate } from '../../hooks/useTranslate'
import { Translate } from '../common/Translate'

import type { FC, ReactNode } from 'react'

type Props = {
  title: ReactNode
  onClickBack: () => void
}

export const MenuSubHeader: FC<Props> = ({ title, onClickBack }) => {
  const translate = useTranslate()

  return (
    <>
      <Button size="s" onClick={onClickBack}>
        <FaArrowLeftIcon role="img" aria-label={translate('MobileHeader/MenuSubHeader/back')} />
      </Button>

      {/* eslint-disable-next-line smarthr/a11y-heading-in-sectioning-content */}
      <Heading type="blockTitle">
        <Translate>{title}</Translate>
      </Heading>
    </>
  )
}
