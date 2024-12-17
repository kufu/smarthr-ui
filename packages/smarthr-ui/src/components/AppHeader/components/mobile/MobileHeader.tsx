import React, { FC } from 'react'

import { HeaderProps } from '../../types'

export const MobileHeader: FC<HeaderProps> = ({ children, className = '', ...props }) => (
  <div className={`${className} min-[752px]:!shr-hidden`}>MobileHeader</div>
)
