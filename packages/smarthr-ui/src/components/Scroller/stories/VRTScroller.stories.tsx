import { Stack } from '../../Layout'

import {
  DirectionBoth,
  DirectionHorizontal,
  DirectionVertical,
  StyleTypeScroll,
} from './Scroller.stories'

import type { Scroller } from '../Scroller'
import type { Meta, StoryObj } from '@storybook/react-webpack5'

export default {
  title: 'Components/Scroller/VRT',
  render: (_args, context) => (
    <Stack>
      {DirectionVertical.render && DirectionVertical.render(DirectionVertical.args!, context)}
      {DirectionHorizontal.render && DirectionHorizontal.render(DirectionHorizontal.args!, context)}
      {DirectionBoth.render && DirectionBoth.render(DirectionBoth.args!, context)}
      {StyleTypeScroll.render && StyleTypeScroll.render(StyleTypeScroll.args!, context)}
    </Stack>
  ),
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
} as Meta<typeof Scroller>

export const VRT = {}

export const VRTForcedColors: StoryObj = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
