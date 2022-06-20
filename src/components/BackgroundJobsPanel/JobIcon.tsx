import React, { VFC } from 'react'

import { useTheme } from '../../hooks/useTheme'
import { Status } from './BackgroundJobsPanel'
import {
  FaCheckCircleIcon,
  FaCloudDownloadAltIcon,
  FaExclamationCircleIcon,
  FaSyncAltIcon,
  IconProps,
  WarningIcon,
} from '../Icon'

type Props = {
  status: Status
}

export const JobIcon: VFC<Props> = ({ status }) => {
  const Icon = getIcon(status)
  const color = useIconColor(status)

  return <Icon color={color} />
}

function getIcon(status: Status): React.ComponentType<IconProps> {
  switch (status) {
    case 'processing':
      return FaSyncAltIcon
    case 'downloading':
      return FaCloudDownloadAltIcon
    case 'warning':
      return WarningIcon
    case 'error':
      return FaExclamationCircleIcon
    case 'done':
      return FaCheckCircleIcon
  }
}

function useIconColor(status: Status) {
  const theme = useTheme()
  const { color } = theme
  switch (status) {
    case 'warning':
      return color.WARNING
    case 'error':
      return color.DANGER
    case 'done':
      return color.MAIN
    default:
      return color.TEXT_BLACK
  }
}
