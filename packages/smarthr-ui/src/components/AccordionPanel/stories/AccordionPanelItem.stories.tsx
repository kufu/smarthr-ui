import React from 'react'

import { AccordionPanel } from '../AccordionPanel'
import { AccordionPanelContent } from '../AccordionPanelContent'
import { AccordionPanelItem } from '../AccordionPanelItem'
import { AccordionPanelTrigger } from '../AccordionPanelTrigger'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Data Display（データ表示）/AccordionPanel/AccordionPanelItem',
  component: AccordionPanelItem,
  render: (args) => (
    <AccordionPanel>
      <AccordionPanelItem {...args}>
        <AccordionPanelTrigger>アコーディオンパネル</AccordionPanelTrigger>
        <AccordionPanelContent>アコーディオンパネルコンテンツ</AccordionPanelContent>
      </AccordionPanelItem>
    </AccordionPanel>
  ),
  args: {},
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof AccordionPanelItem>

export const Playground: StoryObj<typeof AccordionPanelItem> = {
  args: {
    name: 'playground',
  },
}
