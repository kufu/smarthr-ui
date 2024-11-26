import { StoryFn } from '@storybook/react'
import React from 'react'

import { InformationPanel } from '../InformationPanel'
import { Stack } from '../Layout'

import { _Default as Default } from './Stepper.stories'

import { Stepper } from '.'

export default {
  title: 'Data Display（データ表示）/Stepper',
  component: Stepper,
}

export const _VRTStepperForcedColors: StoryFn = () => (
  <Stack gap={1.5}>
    <InformationPanel title="VRT 用の Story です">
      Chromatic 上では強制カラーモードで表示されます
    </InformationPanel>
    <Default />
  </Stack>
)
_VRTStepperForcedColors.parameters = {
  chromatic: { forcedColors: 'active' },
}
