import { action } from 'storybook/actions'

import { Stack } from '../../Layout'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../client'

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ComponentPropsWithoutRef } from 'react'

const _defaultExpandedOptions = {
  あり: ['accordion-panel-2'],
  なし: undefined,
}

export default {
  title: 'Components/Accordion',
  component: Accordion,
  subcomponents: {
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
  },
  render: (args) => (
    <Accordion {...args}>
      {[...Array(3)].map((_, i) => (
        <AccordionItem key={i + 1} name={`accordion-panel-${i + 1}`}>
          <AccordionTrigger>アコーディオンパネル{i + 1}</AccordionTrigger>
          <AccordionContent>アコーディオンパネルコンテンツ{i + 1}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
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
} as Meta<typeof Accordion>

export const Playground: StoryObj<typeof Accordion> = {
  args: {},
}

export const IconPosition: StoryObj<typeof Accordion> = {
  name: 'iconPosition',
  render: (args) => (
    <Stack>
      {(
        [undefined, 'left', 'right'] as Array<
          ComponentPropsWithoutRef<typeof Accordion>['iconPosition']
        >
      ).map((iconPosition) => (
        <Accordion {...args} key={iconPosition} iconPosition={iconPosition}>
          {[...Array(3)].map((_, i) => (
            <AccordionItem key={i + 1} name={`accordion-panel-${iconPosition}-${i + 1}`}>
              <AccordionTrigger>
                アコーディオンパネル{iconPosition}
                {i + 1}
              </AccordionTrigger>
              <AccordionContent>
                アコーディオンパネルコンテンツ{iconPosition}
                {i + 1}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ))}
    </Stack>
  ),
}

export const ExpandableMultiply: StoryObj<typeof Accordion> = {
  name: 'expandableMultiply',
  render: (args) => (
    <Stack>
      {[undefined, true, false].map((expandableMultiply) => (
        <Accordion
          {...args}
          key={String(expandableMultiply)}
          expandableMultiply={expandableMultiply}
        >
          {[...Array(3)].map((_, i) => (
            <AccordionItem key={i + 1} name={`accordion-panel-${expandableMultiply}-${i + 1}`}>
              <AccordionTrigger>
                アコーディオンパネル{String(expandableMultiply)}
                {i + 1}
              </AccordionTrigger>
              <AccordionContent>
                アコーディオンパネルコンテンツ{expandableMultiply}
                {i + 1}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ))}
    </Stack>
  ),
}

export const DefaultExpanded: StoryObj<typeof Accordion> = {
  name: 'defaultExpanded',
  args: {
    defaultExpanded: ['accordion-panel-2'],
  },
}

export const OnClick: StoryObj<typeof Accordion> = {
  name: 'onClick',
  args: {
    onClick: action('click'),
  },
}

export const Rounded: StoryObj<typeof Accordion> = {
  name: 'rounded',
  render: (args) => {
    const template = (rounded?: ComponentPropsWithoutRef<typeof Accordion>['rounded']) => (
      <Accordion {...args} rounded={rounded}>
        {[...Array(2)].map((_, i) => (
          <AccordionItem key={i + 1} name={`accordion-panel-${i + 1}`}>
            <AccordionTrigger>アコーディオンパネル{i + 1}</AccordionTrigger>
            <AccordionContent>アコーディオンパネルコンテンツ{i + 1}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    )

    return (
      <Stack>
        {template()}
        {template(true)}
        {template('all')}
        {template('top')}
        {template('right')}
        {template('bottom')}
        {template('left')}
      </Stack>
    )
  },
}
