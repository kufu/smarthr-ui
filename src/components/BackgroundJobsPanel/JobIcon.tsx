import React, { ComponentProps, FC } from 'react'

import { useTheme } from '../../hooks/useTheme'
import { Status } from './BackgroundJobsPanel'
import { Icon } from '../Icon'

type Props = {
  status: Status
}

export const JobIcon: FC<Props> = ({ status }) => {
  const name = getIconName(status)
  const color = useIconColor(status)

  return <Icon name={name} color={color} />
}

function getIconName(status: Status): ComponentProps<typeof Icon>['name'] {
  switch (status) {
    case 'processing':
      return 'fa-sync-alt'
    case 'downloading':
      return 'fa-cloud-download-alt'
    case 'warning':
      return 'fa-exclamation-triangle'
    case 'error':
      return 'fa-times-circle'
    case 'done':
      return 'fa-check-circle'
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
