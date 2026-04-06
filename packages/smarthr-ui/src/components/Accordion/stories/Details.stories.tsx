import { action } from 'storybook/actions'

import { Stack } from '../../Layout'
import { Details } from '../Details'
import { DetailsContent } from '../DetailsContent'
import { DetailsItem } from '../DetailsItem'
import { Summary } from '../Summary'

import type { Meta, StoryObj } from '@storybook/react-webpack5'
import type { ComponentProps } from 'react'

const _defaultExpandedOptions = {
  あり: ['accordion-panel-2'],
  なし: undefined,
}

export default {
  title: 'Components/Details',
  component: Details,
  subcomponents: {
    DetailsItem,
    Summary,
    DetailsContent,
  },
  render: (args) => (
    <Details {...args}>
      {[...Array(3)].map((_, i) => (
        <DetailsItem key={i + 1} name={`accordion-panel-${i + 1}`}>
          <Summary>アコーディオンパネル{i + 1}</Summary>
          <DetailsContent>アコーディオンパネルコンテンツ{i + 1}</DetailsContent>
        </DetailsItem>
      ))}
    </Details>
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
} as Meta<typeof Details>

export const Playground: StoryObj<typeof Details> = {
  args: {},
}

export const IconPosition: StoryObj<typeof Details> = {
  name: 'iconPosition',
  render: (args) => (
    <Stack>
      {([undefined, 'left', 'right'] as Array<ComponentProps<typeof Details>['iconPosition']>).map(
        (iconPosition) => (
          <Details {...args} key={iconPosition} iconPosition={iconPosition}>
            {[...Array(3)].map((_, i) => (
              <DetailsItem key={i + 1} name={`accordion-panel-${iconPosition}-${i + 1}`}>
                <Summary>
                  アコーディオンパネル{iconPosition}
                  {i + 1}
                </Summary>
                <DetailsContent>
                  アコーディオンパネルコンテンツ{iconPosition}
                  {i + 1}
                </DetailsContent>
              </DetailsItem>
            ))}
          </Details>
        ),
      )}
    </Stack>
  ),
}

export const ExpandableMultiply: StoryObj<typeof Details> = {
  name: 'expandableMultiply',
  render: (args) => (
    <Stack>
      {[undefined, true, false].map((expandableMultiply) => (
        <Details {...args} key={String(expandableMultiply)} expandableMultiply={expandableMultiply}>
          {[...Array(3)].map((_, i) => (
            <DetailsItem key={i + 1} name={`accordion-panel-${expandableMultiply}-${i + 1}`}>
              <Summary>
                アコーディオンパネル{String(expandableMultiply)}
                {i + 1}
              </Summary>
              <DetailsContent>
                アコーディオンパネルコンテンツ{expandableMultiply}
                {i + 1}
              </DetailsContent>
            </DetailsItem>
          ))}
        </Details>
      ))}
    </Stack>
  ),
}

export const DefaultExpanded: StoryObj<typeof Details> = {
  name: 'defaultExpanded',
  args: {
    defaultExpanded: ['accordion-panel-2'],
  },
}

export const OnClick: StoryObj<typeof Details> = {
  name: 'onClick',
  args: {
    onClick: action('click'),
  },
}

export const Rounded: StoryObj<typeof Details> = {
  name: 'rounded',
  render: (args) => {
    const template = (rounded?: ComponentProps<typeof Details>['rounded']) => (
      <Details {...args} rounded={rounded}>
        {[...Array(2)].map((_, i) => (
          <DetailsItem key={i + 1} name={`accordion-panel-${i + 1}`}>
            <Summary>アコーディオンパネル{i + 1}</Summary>
            <DetailsContent>アコーディオンパネルコンテンツ{i + 1}</DetailsContent>
          </DetailsItem>
        ))}
      </Details>
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
