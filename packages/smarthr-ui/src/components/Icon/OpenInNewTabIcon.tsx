'use client'

import { type ComponentProps, memo } from 'react'
import { FaUpRightFromSquare } from 'react-icons/fa6'

import { useIntl } from '../../intl'

import { generateIcon } from './generateIcon'

const FaUpRightFromSquareIcon = /*#__PURE__*/ generateIcon(FaUpRightFromSquare)

type Props = Omit<ComponentProps<typeof FaUpRightFromSquareIcon>, 'alt'>

const OpenInNewTabIcon = memo<Props>((props) => {
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

export { OpenInNewTabIcon }
