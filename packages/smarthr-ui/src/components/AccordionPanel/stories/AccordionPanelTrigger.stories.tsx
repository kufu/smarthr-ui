import React, { ComponentProps } from 'react'

import { AccordionPanel } from '../AccordionPanel'
import { AccordionPanelContent } from '../AccordionPanelContent'
import { AccordionPanelItem } from '../AccordionPanelItem'
import { AccordionPanelTrigger } from '../AccordionPanelTrigger'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Data Display（データ表示）/AccordionPanel/AccordionPanelTrigger',
  component: AccordionPanelTrigger,
  render: (args) => (
    <AccordionPanel>
      <AccordionPanelItem name="accorion-panel-item-">
        <AccordionPanelTrigger {...args} />
        <AccordionPanelContent>アコーディオンパネルコンテンツ</AccordionPanelContent>
      </AccordionPanelItem>
    </AccordionPanel>
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
} satisfies Meta<typeof AccordionPanelTrigger>

export const Playground: StoryObj<typeof AccordionPanelTrigger> = {
  args: {},
}

export const HeadingType: StoryObj<typeof AccordionPanelTrigger> = {
  name: 'headingType',
  render: (args) => (
    <AccordionPanel>
      {(
        [
          undefined,
          'screenTitle',
          'sectionTitle',
          'blockTitle',
          'subBlockTitle',
          'subSubBlockTitle',
        ] as Array<ComponentProps<typeof AccordionPanelTrigger>['headingType']>
      ).map((headingType) => (
        <AccordionPanelItem name={`accorion-panel-item-${headingType}`} key={headingType}>
          <AccordionPanelTrigger {...args} headingType={headingType}>
            {headingType ?? '未指定'}
          </AccordionPanelTrigger>
          <AccordionPanelContent>アコーディオンパネルコンテンツ</AccordionPanelContent>
        </AccordionPanelItem>
      ))}
    </AccordionPanel>
  ),
}

export const HeadingTag: StoryObj<typeof AccordionPanelTrigger> = {
  name: 'headingTag（非推奨）',
  render: (args) => (
    <AccordionPanel>
      {(
        [undefined, 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as Array<
          ComponentProps<typeof AccordionPanelTrigger>['headingTag']
        >
      ).map((headingTag) => (
        <AccordionPanelItem name={`accorion-panel-item-${headingTag}`} key={headingTag}>
          <AccordionPanelTrigger {...args} headingTag={headingTag}>
            {headingTag ?? '未指定'}
          </AccordionPanelTrigger>
          <AccordionPanelContent>アコーディオンパネルコンテンツ</AccordionPanelContent>
        </AccordionPanelItem>
      ))}
    </AccordionPanel>
  ),
}

export const Disabled: StoryObj<typeof AccordionPanelTrigger> = {
  name: 'disabled',
  args: {
    disabled: true,
  },
}
