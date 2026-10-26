import { type ComponentPropsWithRef, memo } from 'react'
import { FaUpRightFromSquare } from 'react-icons/fa6'

import { Localizer } from '../../intl'

import { generateIcon } from './generateIcon'

const FaUpRightFromSquareIcon = /*#__PURE__*/ generateIcon(FaUpRightFromSquare)

type Props = Omit<ComponentPropsWithRef<typeof FaUpRightFromSquareIcon>, 'alt'>

const OpenInNewTabIcon = memo<Props>((props) => (
  <FaUpRightFromSquareIcon
    {...props}
    alt={<Localizer id="smarthr-ui/OpenInNewTabIcon/openInNewTab" defaultText="別タブで開く" />}
  />
))

OpenInNewTabIcon.displayName = 'OpenInNewTabIcon'

export { OpenInNewTabIcon }
