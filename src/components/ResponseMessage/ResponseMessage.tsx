import React, { ComponentProps, PropsWithChildren, useMemo } from 'react'

import { useTheme } from '../../hooks/useTheme'
import {
  FaCheckCircleIcon,
  FaExclamationCircleIcon,
  FaInfoCircleIcon,
  FaSyncAltIcon,
  WarningIcon,
} from '../Icon'

type Props = PropsWithChildren<{
  type: 'info' | 'success' | 'warning' | 'error' | 'sync'
}>

export const ResponseMessage: React.FC<Props & ComponentProps<typeof FaCheckCircleIcon>> = ({
  type,
  children,
  ...other
}) => {
  const theme = useTheme()
  const { color } = theme

  const { Icon, iconColor } = useMemo(() => {
    switch (type) {
      case 'info':
        return {
          Icon: FaInfoCircleIcon,
          iconColor: color.TEXT_GREY,
        }
      case 'success':
        return {
          Icon: FaCheckCircleIcon,
          iconColor: color.MAIN,
        }
      case 'warning':
        return {
          Icon: WarningIcon,
        }
      case 'error':
        return {
          Icon: FaExclamationCircleIcon,
          iconColor: color.DANGER,
        }
      case 'sync':
        return {
          Icon: FaSyncAltIcon,
          iconColor: color.MAIN,
        }
    }
  }, [type, color])

  return <Icon {...other} text={children} color={iconColor} />
}
