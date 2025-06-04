'use client'

import { type FC, memo } from 'react'

import { Localizer } from '../../../intl/Localizer'
import { StatusLabel } from '../StatusLabel'

export const RequiredLabel: FC = memo(() => (
  <StatusLabel type="red">
    <Localizer id="smarthr-ui/RequiredLabel/text" defaultText="必須" />
  </StatusLabel>
))
