import { Details } from '../Details'
import { DetailsContent } from '../DetailsContent'
import { DetailsItem } from '../DetailsItem'
import { Summary } from '../Summary'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

export default {
  title: 'Components/Details/DetailsItem',
  component: DetailsItem,
  render: (args) => (
    <Details>
      <DetailsItem {...args}>
        <Summary>アコーディオンパネル</Summary>
        <DetailsContent>アコーディオンパネルコンテンツ</DetailsContent>
      </DetailsItem>
    </Details>
  ),
  args: {},
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof DetailsItem>

export const Playground: StoryObj<typeof DetailsItem> = {
  args: {
    name: 'playground',
  },
}
