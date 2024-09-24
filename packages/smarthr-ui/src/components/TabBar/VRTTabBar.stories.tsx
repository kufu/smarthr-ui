import { action } from '@storybook/addon-actions'
import { fireEvent, within } from '@storybook/test'
import React from 'react'

import { Badge } from '../Badge'
import { FaCircleExclamationIcon } from '../Icon'
import { Stack } from '../Layout'

import { TabBar } from './TabBar'
import { TabItem } from './TabItem'

import type { StoryObj } from '@storybook/react'

export default {
  title: 'Navigation（ナビゲーション）/TabBar/VRT',
  /* ペアワイズ法による網羅
   * bordered selected diasbled suffix disabledDetail
   * false    false    false    あり    なし
   * false    true     true     なし    あり
   * true     true     true     あり    なし
   * true     false    true     なし    あり
   * true     true     false    あり    あり
   * true     false    false    なし    なし */
  render: (args: any) => (
    <Stack {...args}>
      <TabBar bordered={false}>
        <TabItem id="tab1" onClick={action('clicked')} suffix={<Badge count={100} />}>
          タブ1
        </TabItem>
        <TabItem
          id="tab2"
          onClick={action('clicked')}
          selected
          disabled
          disabledDetail={{ message: 'タブが無効な理由' }}
        >
          タブ2
        </TabItem>
      </TabBar>
      <TabBar>
        <TabItem
          id="tab3"
          onClick={action('clicked')}
          selected
          disabled
          suffix={<Badge count={100} />}
        >
          タブ3
        </TabItem>
        <TabItem
          id="tab4"
          onClick={action('clicked')}
          disabled
          disabledDetail={{ message: 'タブが無効な理由' }}
        >
          タブ4
        </TabItem>
        <TabItem
          id="tab5"
          onClick={action('clicked')}
          selected
          suffix={<FaCircleExclamationIcon color="DANGER" />}
          disabledDetail={{ message: 'タブが無効な理由' }}
        >
          タブ5
        </TabItem>
        <TabItem id="tab6" onClick={action('clicked')}>
          タブ6
        </TabItem>
      </TabBar>
    </Stack>
  ),
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
}

export const VRT = {}

export const VRTHover = {
  ...VRT,
  args: {
    id: 'hover',
  },
  parameters: {
    pseudo: {
      hover: ['#hover .smarthr-ui-TabItem'],
    },
  },
}

export const VRTKeyboardFocus: StoryObj = {
  ...VRT,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const tabs = canvas.getAllByRole('tab')
    // bordered で disabledDetail が存在するアイテムにフォーカス
    tabs[3].focus()
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
