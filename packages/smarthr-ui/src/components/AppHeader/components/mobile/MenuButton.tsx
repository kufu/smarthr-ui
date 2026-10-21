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
    className="shr-gap-0 shr-px-0.5"
    handleClick={handleClick}
    suffix={<FaAngleRightIcon color="TEXT_BLACK" />}
  >
    {children}
  </CommonButton>
))
