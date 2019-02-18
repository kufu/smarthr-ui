import * as React from 'react'

import { Check } from './svg/Check'

export interface IconProps {
  fill?: string
  width?: number
  height?: number
}

export interface Props extends IconProps {
  name: keyof typeof iconMap
}

const iconMap = {
  check: Check,
}

export const Icon: React.FC<Props> = ({ name, ...props }) => {
  const SvgIcon = iconMap[name]
  return <SvgIcon {...props} />
}
