import {
  AccordionPanel,
  AccordionPanelContent,
  AccordionPanelItem,
  AccordionPanelTrigger,
} from '../client'

import type { Meta, StoryObj } from '@storybook/react-vite'

export default {
  title: 'Components/AccordionPanel/AccordionPanelItem',
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
