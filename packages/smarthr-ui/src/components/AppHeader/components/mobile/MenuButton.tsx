import { type PropsWithChildren, memo } from 'react'

import { FaAngleRightIcon } from '../../../Icon'
import { CommonButton } from '../common/CommonButton'
import { Translate } from '../common/Translate'

type Props = PropsWithChildren<{
  onClick: () => void
  isCurrent?: boolean
}>

export const MenuButton = memo<Props>(({ children, onClick, isCurrent }) => (
  <CommonButton
    elementAs="button"
    type="button"
    onClick={onClick}
    current={isCurrent}
    boldWhenCurrent
    className="[&&]:shr-px-0.5 [&&]:shr-justify-between"
  >
    <Translate>{children}</Translate>
    <FaAngleRightIcon color="TEXT_BLACK" />
  </CommonButton>
))
