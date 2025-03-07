import React, { FC, ReactNode } from 'react'

import { Button } from '../../../Button'
import { Heading } from '../../../Heading'
import { FaArrowLeftIcon } from '../../../Icon'
import { useIntl } from '../../../..'

type Props = {
  title: ReactNode
  onClickBack: () => void
}

export const MenuSubHeader: FC<Props> = ({ title, onClickBack }) => {
  const { localize } = useIntl()

  return (
    <>
      <Button size="s" onClick={onClickBack}>
        <FaArrowLeftIcon
          role="img"
          aria-label={localize({ id: 'smarthr-ui/AppHeader/back', defaultText: '戻る' })}
        />
      </Button>

      {/* eslint-disable-next-line smarthr/a11y-heading-in-sectioning-content */}
      <Heading type="blockTitle">{title}</Heading>
    </>
  )
}
