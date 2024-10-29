import { action } from '@storybook/addon-actions'
import React, { ComponentProps } from 'react'

import { Stack } from '../../Layout'
import { AccordionPanel } from '../AccordionPanel'
import { AccordionPanelContent } from '../AccordionPanelContent'
import { AccordionPanelItem } from '../AccordionPanelItem'
import { AccordionPanelTrigger } from '../AccordionPanelTrigger'

import type { Meta, StoryObj } from '@storybook/react'

const _defaultExpandedOptions = {
  あり: ['accordion-panel-2'],
  なし: undefined,
}

export default {
  title: 'Data Display（データ表示）/AccordionPanel',
  component: AccordionPanel,
  subcomponents: {
    AccordionPanelItem,
    AccordionPanelTrigger,
    AccordionPanelContent,
  },
  render: (args) => (
    <AccordionPanel {...args}>
      {[...Array(3)].map((_, i) => (
        <AccordionPanelItem key={i + 1} name={`accordion-panel-${i + 1}`}>
          <AccordionPanelTrigger>アコーディオンパネル{i + 1}</AccordionPanelTrigger>
          <AccordionPanelContent>アコーディオンパネルコンテンツ{i + 1}</AccordionPanelContent>
        </AccordionPanelItem>
      ))}
    </AccordionPanel>
  ),
  argTypes: {
    defaultExpanded: {
      control: 'radio',
      options: Object.keys(_defaultExpandedOptions),
      mapping: _defaultExpandedOptions,
    },
  },
  args: {},
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof AccordionPanel>

export const Playground: StoryObj<typeof AccordionPanel> = {
  args: {},
}

export const IconPosition: StoryObj<typeof AccordionPanel> = {
  name: 'iconPosition',
  render: (args) => (
    <Stack>
      {(
        [undefined, 'left', 'right'] as Array<ComponentProps<typeof AccordionPanel>['iconPosition']>
      ).map((iconPosition) => (
        <AccordionPanel {...args} key={iconPosition} iconPosition={iconPosition}>
          {[...Array(3)].map((_, i) => (
            <AccordionPanelItem key={i + 1} name={`accordion-panel-${iconPosition}-${i + 1}`}>
              <AccordionPanelTrigger>
                アコーディオンパネル{iconPosition}
                {i + 1}
              </AccordionPanelTrigger>
              <AccordionPanelContent>
                アコーディオンパネルコンテンツ{iconPosition}
                {i + 1}
              </AccordionPanelContent>
            </AccordionPanelItem>
          ))}
        </AccordionPanel>
      ))}
    </Stack>
  ),
}

export const ExpandableMultiply: StoryObj<typeof AccordionPanel> = {
  name: 'expandableMultiply',
  render: (args) => (
    <Stack>
      {[undefined, true, false].map((expandableMultiply) => (
        <AccordionPanel
          {...args}
          key={String(expandableMultiply)}
          expandableMultiply={expandableMultiply}
        >
          {[...Array(3)].map((_, i) => (
            <AccordionPanelItem key={i + 1} name={`accordion-panel-${expandableMultiply}-${i + 1}`}>
              <AccordionPanelTrigger>
                アコーディオンパネル{String(expandableMultiply)}
                {i + 1}
              </AccordionPanelTrigger>
              <AccordionPanelContent>
                アコーディオンパネルコンテンツ{expandableMultiply}
                {i + 1}
              </AccordionPanelContent>
            </AccordionPanelItem>
          ))}
        </AccordionPanel>
      ))}
    </Stack>
  ),
}

export const DefaultExpanded: StoryObj<typeof AccordionPanel> = {
  name: 'defaultExpanded',
  args: {
    defaultExpanded: ['accordion-panel-2'],
  },
}

export const OnClick: StoryObj<typeof AccordionPanel> = {
  name: 'onClick',
  args: {
    onClick: action('click'),
  },
}
