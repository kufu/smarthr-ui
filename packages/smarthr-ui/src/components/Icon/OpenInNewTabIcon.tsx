'use client'

import { type ComponentProps, memo } from 'react'

import { useIntl } from '../../intl'
import { FaUpRightFromSquareIcon } from '../Icon'

type Props = Omit<ComponentProps<typeof FaUpRightFromSquareIcon>, 'alt'>

export const OpenInNewTabIcon = memo<Props>((props) => {
  const { localize } = useIntl()

  return (
    <FaUpRightFromSquareIcon
      {...props}
      alt={localize({
        id: 'smarthr-ui/OpenInNewTabIcon/openInNewTab',
        defaultText: '別タブで開く',
      })}
    />
  )
})

OpenInNewTabIcon.displayName = 'OpenInNewTabIcon'
