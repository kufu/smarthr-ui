import { memo } from 'react'

import { FaAngleRightIcon } from '../../../Icon'
import { CommonButton } from '../common/CommonButton'

import type { ExtendElementPropsWithRef } from '../../../../types'

type Props = ExtendElementPropsWithRef<
  'button',
  {
    handleClick: () => void
    isCurrent?: boolean
  },
  { omit: 'onClick' | 'type' | 'className' }
>

export const MenuButton = memo<Props>(({ children, handleClick, isCurrent, ...rest }) => (
  <CommonButton
    {...rest}
    elementAs="button"
    type="button"
    current={isCurrent}
    boldWhenCurrent
    className="[&&]:shr-justify-between [&&]:shr-px-0.5"
    handleClick={handleClick}
  >
    {children}
    <FaAngleRightIcon color="TEXT_BLACK" />
  </CommonButton>
))
