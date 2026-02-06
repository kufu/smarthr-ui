import { action } from 'storybook/actions'

import { Stack } from '../../Layout'
import { InformationPanel, classNameGenerator } from '../InformationPanel'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

export default {
  title: 'Components/InformationPanel',
  component: InformationPanel,
  render: (args) => <InformationPanel {...args} />,
  args: {
    heading: 'インフォメーションパネルタイトル',
    children: 'インフォメーションパネルボディ',
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof InformationPanel>

export const Playground: StoryObj<typeof InformationPanel> = {
  args: {},
}

export const Type: StoryObj<typeof InformationPanel> = {
  name: 'type',
  render: (args) => (
    <Stack>
      {Object.keys(classNameGenerator.variants.type).map((type) => (
        <InformationPanel {...args} type={type as any} key={type} />
      ))}
    </Stack>
  ),
}

export const Bold: StoryObj<typeof InformationPanel> = {
  name: 'bold',
  render: (args) => (
    <Stack>
      <InformationPanel {...args} type="success" />
      <InformationPanel {...args} type="warning" />
      <InformationPanel {...args} type="error" />
    </Stack>
  ),
  args: {
    bold: true,
  },
}

export const Heading: StoryObj<typeof InformationPanel> = {
  name: 'heading',
}

export const HeadingTag: StoryObj<typeof InformationPanel> = {
  name: 'heading.unrecommendedTag（非推奨）',
  args: {
    heading: {
      text: 'インフォメーションパネルタイトル',
      unrecommendedTag: 'h3',
    },
  },
}

export const Toggleable: StoryObj<typeof InformationPanel> = {
  name: 'toggleable',
  render: (args) => (
    <Stack>
      {[undefined, false, true].map((toggleable) => (
        <InformationPanel
          {...args}
          heading={`toggleable: ${toggleable}`}
          toggleable={toggleable}
          key={String(toggleable)}
        />
      ))}
    </Stack>
  ),
}

export const Active: StoryObj<typeof InformationPanel> = {
  name: 'active',
  render: (args) => (
    <Stack>
      {[undefined, false, true].map((active) => (
        <InformationPanel
          {...args}
          heading={`active: ${active}`}
          active={active}
          key={String(active)}
        />
      ))}
    </Stack>
  ),
}

export const OnClickTrigger: StoryObj<typeof InformationPanel> = {
  name: 'onClickTrigger',
  args: {
    onClickTrigger: action('onclick'),
  },
}
