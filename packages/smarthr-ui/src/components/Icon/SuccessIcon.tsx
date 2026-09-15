import { type ComponentProps, memo } from 'react'

import { Localizer } from '../../intl'

import { FaCircleCheckIcon } from './FaIcon'

type Props = ComponentProps<typeof FaCircleCheckIcon>

const ALT = <Localizer id="smarthr-ui/statusIcon/successAlt" defaultText="成功" />

export const SuccessIcon = memo<Props>(({ alt = ALT, ...rest }) => (
  <FaCircleCheckIcon {...rest} alt={alt} />
))
