import React from 'react'

import { AccordionPanel } from '../AccordionPanel'
import { AccordionPanelContent } from '../AccordionPanelContent'
import { AccordionPanelItem } from '../AccordionPanelItem'
import { AccordionPanelTrigger } from '../AccordionPanelTrigger'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Data Display（データ表示）/AccordionPanel/AccordionPanelContent',
  component: AccordionPanelContent,
  render: (args) => (
    <AccordionPanel defaultExpanded={['accordion-panel-item']}>
      <AccordionPanelItem name="accordion-panel-item">
        <AccordionPanelTrigger>アコーディオンパネル</AccordionPanelTrigger>
        <AccordionPanelContent {...args} />
      </AccordionPanelItem>
    </AccordionPanel>
  ),
  argTypes: {
    children: { control: 'text' },
  },
  args: {
    children: 'アコーディオンパネルコンテンツ',
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof AccordionPanelContent>

export const Playground: StoryObj<typeof AccordionPanelContent> = {
  args: {},
}
