import { action } from 'storybook/actions'
import { fireEvent, within } from 'storybook/test'

import { Badge } from '../../Badge'
import { FaCircleExclamationIcon } from '../../Icon'
import { Stack } from '../../Layout'
import { TabBar } from '../TabBar'
import { TabItem } from '../TabItem'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

export default {
  title: 'Components/TabBar/VRT',
  /* ペアワイズ法による網羅
   * bordered selected disabled suffix disabledReason
   * false    false    false    あり    なし
   * false    true     true     なし    あり
   * true     true     true     あり    なし
   * true     false    true     なし    あり
   * true     true     false    あり    あり
   * true     false    false    なし    なし */
  render: (args) => (
    <Stack>
      {[undefined, 'hover', 'focus-visible'].map((variant) => (
        <Stack key={variant} id={variant}>
          <TabBar {...args} bordered={false}>
            <TabItem id="tab1" onClick={action('clicked')} suffix={<Badge count={100} />}>
              タブ1
            </TabItem>
            <TabItem
              id="tab2"
              disabled
              disabledReason={{ message: 'タブが無効な理由' }}
              selected
              onClick={action('clicked')}
            >
              タブ2
            </TabItem>
          </TabBar>
          <TabBar>
            <TabItem
              id="tab3"
              disabled
              selected
              onClick={action('clicked')}
              suffix={<Badge count={100} />}
            >
              タブ3
            </TabItem>
            <TabItem
              id="tab4"
              disabled
              disabledReason={{ message: 'タブが無効な理由' }}
              onClick={action('clicked')}
            >
              タブ4
            </TabItem>
            <TabItem
              id="tab5"
              disabledReason={{ message: 'タブが無効な理由' }}
              selected
              onClick={action('clicked')}
              suffix={<FaCircleExclamationIcon color="DANGER" />}
            >
              タブ5
            </TabItem>
            <TabItem id="tab6" onClick={action('clicked')}>
              タブ6
            </TabItem>
          </TabBar>
        </Stack>
      ))}
    </Stack>
  ),
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
} satisfies Meta<typeof TabBar>

export const VRT = {
  parameters: {
    pseudo: {
      hover: ['#hover .smarthr-ui-TabItem'],
      focusVisible: ['#focus-visible .smarthr-ui-TabItem'],
    },
  },
}

export const VRTNarrowView: StoryObj = {
  ...VRT,
  parameters: {
    viewport: {
      defaultViewport: 'vrtMobile',
    },
    chromatic: {
      modes: {
        vrtMobile: { viewport: 'vrtMobile' },
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const tabs = canvas.getAllByRole('tablist')
    const scrollableElement = tabs[1]
    await fireEvent.scroll(scrollableElement, { target: { scrollLeft: 1000 } })
  },
}

export const VRTForcedColors: StoryObj = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
