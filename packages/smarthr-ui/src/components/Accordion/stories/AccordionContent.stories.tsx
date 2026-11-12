import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../client'

import type { Meta, StoryObj } from '@storybook/react-vite'

export default {
  title: 'Components/Accordion/AccordionContent',
  component: AccordionContent,
  render: (args) => (
    <Accordion defaultExpanded={['accordion-panel-item']}>
      <AccordionItem name="accordion-panel-item">
        <AccordionTrigger>アコーディオンパネル</AccordionTrigger>
        <AccordionContent {...args} />
      </AccordionItem>
    </Accordion>
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
} satisfies Meta<typeof AccordionContent>

export const Playground: StoryObj<typeof AccordionContent> = {
  args: {},
}
