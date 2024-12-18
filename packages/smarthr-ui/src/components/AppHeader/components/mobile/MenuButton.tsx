import React, { FC, PropsWithChildren } from 'react'

import { FaAngleRightIcon } from '../../../Icon'
import { CommonButton } from '../common/CommonButton'

type Props = {
  onClick: () => void
  isCurrent?: boolean
}

export const MenuButton: FC<PropsWithChildren<Props>> = ({ children, onClick, isCurrent }) => (
  <CommonButton
    elementAs="button"
    type="button"
    onClick={onClick}
    current={isCurrent}
    boldWhenCurrent
    className="[&&]:shr-px-0.5 [&&]:shr-justify-between"
  >
    {children}
    <FaAngleRightIcon color="TEXT_BLACK" />
  </CommonButton>
)
