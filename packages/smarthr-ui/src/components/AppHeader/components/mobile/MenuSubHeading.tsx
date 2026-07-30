import { type ReactNode, memo } from 'react'

import { Localizer } from '../../../../intl'
import { Button } from '../../../Button'
import { Heading } from '../../../Heading'
import { FaArrowLeftIcon } from '../../../Icon'
import { Translate } from '../common/Translate'

type Props = {
  title: ReactNode
  onClickBack: () => void
}

export const MenuSubHeading = memo<Props>(({ title, onClickBack }) => (
  <>
    <Button size="S" onClick={onClickBack}>
      <FaArrowLeftIcon
        alt={<Localizer id="smarthr-ui/AppHeader/MobileHeader/back" defaultText="戻る" />}
      />
    </Button>
    <Heading type="blockTitle">
      <Translate>{title}</Translate>
    </Heading>
  </>
))
