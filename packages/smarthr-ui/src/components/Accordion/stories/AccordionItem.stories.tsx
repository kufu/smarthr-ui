import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../client'

import type { Meta, StoryObj } from '@storybook/react-vite'

export default {
  title: 'Components/Accordion/AccordionItem',
  component: AccordionItem,
  render: (args) => (
    <Accordion>
      <AccordionItem {...args}>
        <AccordionTrigger>アコーディオンパネル</AccordionTrigger>
        <AccordionContent>アコーディオンパネルコンテンツ</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
  args: {},
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof AccordionItem>

export const Playground: StoryObj<typeof AccordionItem> = {
  args: {
    name: 'playground',
  },
}
