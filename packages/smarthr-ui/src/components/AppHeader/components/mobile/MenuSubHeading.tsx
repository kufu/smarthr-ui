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

export const MenuSubHeading = memo<Props>(({ title, onClickBack }) => {
  const translate = useTranslate()
  const backButtonAriaLabel = useMemo(
    () => translate('MobileHeader/MenuSubHeading/back'),
    [translate],
  )

  return (
    <>
      <Button size="s" onClick={onClickBack}>
        <FaArrowLeftIcon role="img" aria-label={backButtonAriaLabel} />
      </Button>

      <Heading type="blockTitle">
        <Translate>{title}</Translate>
      </Heading>
    </>
  )
})
