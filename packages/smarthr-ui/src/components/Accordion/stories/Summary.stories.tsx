import { Details } from '../Details'
import { DetailsContent } from '../DetailsContent'
import { DetailsItem } from '../DetailsItem'
import { Summary } from '../Summary'

import type { Meta, StoryObj } from '@storybook/react-webpack5'
import type { ComponentProps } from 'react'

export default {
  title: 'Components/Details/Summary',
  component: Summary,
  render: (args) => (
    <Details>
      <DetailsItem name="accorion-panel-item-">
        <Summary {...args} />
        <DetailsContent>アコーディオンパネルコンテンツ</DetailsContent>
      </DetailsItem>
    </Details>
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
} satisfies Meta<typeof Summary>

export const Playground: StoryObj<typeof Summary> = {
  args: {},
}

export const HeadingType: StoryObj<typeof Summary> = {
  name: 'headingType',
  render: (args) => (
    <Details>
      {(
        [
          undefined,
          'screenTitle',
          'sectionTitle',
          'blockTitle',
          'subBlockTitle',
          'subSubBlockTitle',
        ] as Array<ComponentProps<typeof Summary>['headingType']>
      ).map((headingType) => (
        <DetailsItem name={`accorion-panel-item-${headingType}`} key={headingType}>
          <Summary {...args} headingType={headingType}>
            {headingType ?? '未指定'}
          </Summary>
          <DetailsContent>アコーディオンパネルコンテンツ</DetailsContent>
        </DetailsItem>
      ))}
    </Details>
  ),
}

export const UnrecommendedHeadingTag: StoryObj<typeof Summary> = {
  name: 'unrecommendedHeadingTag（非推奨）',
  render: (args) => (
    <Details>
      {(
        [undefined, 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as Array<
          ComponentProps<typeof Summary>['unrecommendedHeadingTag']
        >
      ).map((unrecommendedHeadingTag) => (
        <DetailsItem
          name={`accorion-panel-item-${unrecommendedHeadingTag}`}
          key={unrecommendedHeadingTag}
        >
          <Summary {...args} unrecommendedHeadingTag={unrecommendedHeadingTag}>
            {unrecommendedHeadingTag ?? '未指定'}
          </Summary>
          <DetailsContent>アコーディオンパネルコンテンツ</DetailsContent>
        </DetailsItem>
      ))}
    </Details>
  ),
}

export const Disabled: StoryObj<typeof Summary> = {
  name: 'disabled',
  args: {
    disabled: true,
  },
}
