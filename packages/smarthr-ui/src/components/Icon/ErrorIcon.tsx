import { type ComponentProps, memo } from 'react'

import { Localizer } from '../../intl'

import { FaCircleExclamationIcon } from './FaIcon'

type Props = ComponentProps<typeof FaCircleExclamationIcon>

const ALT = <Localizer id="smarthr-ui/statusIcon/errorAlt" defaultText="エラー" />

export const ErrorIcon = memo<Props>(({ alt = ALT, ...rest }) => (
  <FaCircleExclamationIcon {...rest} alt={alt} />
))
