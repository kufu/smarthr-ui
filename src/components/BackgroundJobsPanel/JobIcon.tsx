import React, { FC } from 'react'

import { useTheme } from '../../hooks/useTheme'
import { Status } from './BackgroundJobsPanel'
import {
  FaCheckCircleIcon,
  FaCloudDownloadAltIcon,
  FaExclamationTriangleIcon,
  FaSyncAltIcon,
  FaTimesCircleIcon,
  IconProps,
} from '../Icon'

type Props = {
  status: Status
}

export const JobIcon: FC<Props> = ({ status }) => {
  const Icon = getIcon(status)
  const color = useIconColor(status)

  return <Icon color={color} size={16} />
}

function getIcon(status: Status): React.ComponentType<IconProps> {
  switch (status) {
    case 'processing':
      return FaSyncAltIcon
    case 'downloading':
      return FaCloudDownloadAltIcon
    case 'warning':
      return FaExclamationTriangleIcon
    case 'error':
      return FaTimesCircleIcon
    case 'done':
      return FaCheckCircleIcon
  }
}

function useIconColor(status: Status) {
  const theme = useTheme()
  const { palette } = theme
  switch (status) {
    case 'warning':
      return palette.WARNING
    case 'error':
      return palette.DANGER
    case 'done':
      return palette.TEXT_GREY
    default:
      return palette.TEXT_BLACK
  }
}
