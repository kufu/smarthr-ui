'use client'

import { memo } from 'react'

import { useIntl } from '../../intl'
import { FaUpRightFromSquareIcon } from '../Icon'

export const OpenInNewTabIcon = memo(() => {
  const { localize } = useIntl()
  return (
    <FaUpRightFromSquareIcon
      alt={localize({
        id: 'smarthr-ui/OpenInNewTabIcon/openInNewTab',
        defaultText: '別タブで開く',
      })}
    />
  )
})
