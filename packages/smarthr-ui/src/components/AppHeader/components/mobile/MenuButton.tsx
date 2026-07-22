import { type PropsWithChildren, memo } from 'react'

import { FaAngleRightIcon } from '../../../Icon'
import { CommonButton } from '../common/CommonButton'
import { Translate } from '../common/Translate'

type Props = PropsWithChildren<{
  handleClick: () => void
  isCurrent?: boolean
}>

export const MenuButton = memo<Props>(({ children, handleClick, isCurrent }) => (
  <CommonButton
    elementAs="button"
    type="button"
    onClick={handleClick}
    current={isCurrent}
    boldWhenCurrent
    className="[&&]:shr-justify-between [&&]:shr-px-0.5"
  >
    <Translate>{children}</Translate>
    <FaAngleRightIcon color="TEXT_BLACK" />
  </CommonButton>
))
