'use client'

import { type ComponentProps, memo } from 'react'
import { FaUpRightFromSquare } from 'react-icons/fa6'

import { useIntl } from '../../intl'

import { generateIcon } from './generateIcon'

const FaUpRightFromSquareIcon = /*#__PURE__*/ generateIcon(FaUpRightFromSquare)

// TODO: 最終的にこのコンポーネントはexportされず、TextLink, AnchorButtonからのみ
// 参照される状態になるため、alt属性は固定される想定です。
// type Props = Omit<ComponentProps<typeof FaUpRightFromSquareIcon>, 'alt'>
type Props = ComponentProps<typeof FaUpRightFromSquareIcon>

const OpenInNewTabIcon = memo<Props>(({ alt, ...rest }) => {
  const { localize } = useIntl()

  return (
    <FaUpRightFromSquareIcon
      {...rest}
      alt={
        alt ||
        localize({
          id: 'smarthr-ui/OpenInNewTabIcon/openInNewTab',
          defaultText: '別タブで開く',
        })
      }
    />
  )
})

OpenInNewTabIcon.displayName = 'OpenInNewTabIcon'

export { OpenInNewTabIcon }
