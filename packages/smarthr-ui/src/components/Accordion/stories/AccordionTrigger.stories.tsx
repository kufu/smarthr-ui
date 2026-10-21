import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../client'

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ComponentPropsWithoutRef } from 'react'

export default {
  title: 'Components/Accordion/AccordionTrigger',
  component: AccordionTrigger,
  render: (args) => (
    <Accordion>
      <AccordionItem name="accorion-panel-item-">
        <AccordionTrigger {...args} />
        <AccordionContent>アコーディオンパネルコンテンツ</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
  argTypes: {
    children: { control: 'text' },
    disabled: { control: 'boolean' },
  },
  args: {
    children: 'アコーディオンパネル',
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof AccordionTrigger>

export const Playground: StoryObj<typeof AccordionTrigger> = {
  args: {},
}

export const HeadingType: StoryObj<typeof AccordionTrigger> = {
  name: 'headingType',
  render: (args) => (
    <Accordion>
      {(
        [
          undefined,
          'screenTitle',
          'sectionTitle',
          'blockTitle',
          'subBlockTitle',
          'subSubBlockTitle',
        ] as Array<ComponentPropsWithoutRef<typeof AccordionTrigger>['headingType']>
      ).map((headingType) => (
        <AccordionItem key={headingType} name={`accorion-panel-item-${headingType}`}>
          <AccordionTrigger {...args} headingType={headingType}>
            {headingType ?? '未指定'}
          </AccordionTrigger>
          <AccordionContent>アコーディオンパネルコンテンツ</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
}

export const UnrecommendedHeadingTag: StoryObj<typeof AccordionTrigger> = {
  name: 'unrecommendedHeadingTag（非推奨）',
  render: (args) => (
    <Accordion>
      {(
        [undefined, 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as Array<
          ComponentPropsWithoutRef<typeof AccordionTrigger>['unrecommendedHeadingTag']
        >
      ).map((unrecommendedHeadingTag) => (
        <AccordionItem
          key={unrecommendedHeadingTag}
          name={`accorion-panel-item-${unrecommendedHeadingTag}`}
        >
          <AccordionTrigger {...args} unrecommendedHeadingTag={unrecommendedHeadingTag}>
            {unrecommendedHeadingTag ?? '未指定'}
          </AccordionTrigger>
          <AccordionContent>アコーディオンパネルコンテンツ</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
}

export const Disabled: StoryObj<typeof AccordionTrigger> = {
  name: 'disabled',
  args: {
    disabled: true,
  },
}
