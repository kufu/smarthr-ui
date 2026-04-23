import { Details } from '../Details'
import { DetailsContent } from '../DetailsContent'
import { DetailsItem } from '../DetailsItem'
import { Summary } from '../Summary'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

export default {
  title: 'Components/Details/DetailsContent',
  component: DetailsContent,
  render: (args) => (
    <Details defaultExpanded={['accordion-panel-item']}>
      <DetailsItem name="accordion-panel-item">
        <Summary>アコーディオンパネル</Summary>
        <DetailsContent {...args} />
      </DetailsItem>
    </Details>
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
} satisfies Meta<typeof DetailsContent>

export const Playground: StoryObj<typeof DetailsContent> = {
  args: {},
}
