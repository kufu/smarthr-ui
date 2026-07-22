import { type ReactNode, memo, useMemo } from 'react'

import { useIntl } from '../../../../intl'
import { Button } from '../../../Button'
import { Heading } from '../../../Heading'
import { FaArrowLeftIcon } from '../../../Icon'
import { Translate } from '../common/Translate'

type Props = {
  title: ReactNode
  handleClickBack: () => void
}

export const MenuSubHeading = memo<Props>(({ title, handleClickBack }) => {
  const { localize } = useIntl()
  const backButtonAriaLabel = useMemo(
    () => localize({ id: 'smarthr-ui/AppHeader/MobileHeader/back', defaultText: '戻る' }),
    [localize],
  )

  return (
    <>
      <Button size="S" onClick={handleClickBack}>
        <FaArrowLeftIcon alt={backButtonAriaLabel} />
      </Button>
      <Heading type="blockTitle">
        <Translate>{title}</Translate>
      </Heading>
    </>
  )
})
