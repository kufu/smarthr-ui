'use client'

import { memo } from 'react'

import { useIntl } from '../../intl'
import { FaUpRightFromSquareIcon } from '../Icon'

export const OpenInNewTabIcon = memo(() => {
  const { localize } = useIntl()
  return (
    <FaUpRightFromSquareIcon
      aria-hidden={true}
      alt={localize({ id: 'smarthr-ui/TextLink/openInNewTab', defaultText: '別タブで開く' })}
    />
  )
})
