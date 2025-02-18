import React, { type ReactNode, memo } from 'react'

import { Button } from '../../../Button'
import { Heading } from '../../../Heading'
import { FaArrowLeftIcon } from '../../../Icon'
import { useTranslate } from '../../hooks/useTranslate'
import { Translate } from '../common/Translate'

type Props = {
  title: ReactNode
  onClickBack: () => void
}

export const MenuSubHeader = memo<Props>(({ title, onClickBack }) => {
  const translate = useTranslate()
  const backButtonAriaLabel = useMemo(
    () => translate('MobileHeader/MenuSubHeader/back'),
    [translate],
  )

  return (
    <>
      <Button size="s" onClick={onClickBack}>
        <FaArrowLeftIcon role="img" aria-label={backButtonAriaLabel} />
      </Button>

      {/* eslint-disable-next-line smarthr/a11y-heading-in-sectioning-content */}
      <Heading type="blockTitle">
        <Translate>{title}</Translate>
      </Heading>
    </>
  )
})
