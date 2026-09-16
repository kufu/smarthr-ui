import { type ComponentProps, memo } from 'react'

import { Localizer } from '../../intl'

import { FaRotateIcon } from './FaIcon'

type Props = ComponentProps<typeof FaRotateIcon>

const ALT = <Localizer id="smarthr-ui/statusIcon/syncAlt" defaultText="実行中" />

export const SyncIcon = memo<Props>(({ alt = ALT, ...rest }) => (
  <FaRotateIcon {...rest} alt={alt} />
))
