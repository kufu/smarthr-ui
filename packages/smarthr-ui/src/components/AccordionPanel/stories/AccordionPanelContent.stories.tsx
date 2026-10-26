import {
  AccordionPanel,
  AccordionPanelContent,
  AccordionPanelItem,
  AccordionPanelTrigger,
} from '../client'

import type { Meta, StoryObj } from '@storybook/react-vite'

export default {
  title: 'Components/AccordionPanel/AccordionPanelContent',
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
