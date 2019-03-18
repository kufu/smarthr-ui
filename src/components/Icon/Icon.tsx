import * as React from 'react'

import { Check } from './svg/Check'
import { CheckCircle } from './svg/CheckCircle'
import { Cross } from './svg/Cross'
import { ExclamationTriangle } from './svg/ExclamationTriangle'

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
  'check-circle': CheckCircle,
  cross: Cross,
  'exclamation-triangle': ExclamationTriangle,
}

export const Icon: React.FC<Props> = ({ name, ...props }) => {
  const SvgIcon = iconMap[name]
  return <SvgIcon {...props} />
}
