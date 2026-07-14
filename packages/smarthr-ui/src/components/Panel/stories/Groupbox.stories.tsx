import { backgroundColor } from '../../../tailwind'
import { defaultBackgroundColor as backgroundColorValue } from '../../../themes'
import { Stack } from '../../Layout'
import { baseClassNameGenerator } from '../Base'
import { Groupbox } from '../Groupbox'

import type { Gap } from '../../../types'
import type { Meta, StoryObj } from '@storybook/react-webpack5'

const basePadding = Object.keys(baseClassNameGenerator.variants.paddingBlock)
  // Tシャツサイズは後方互換性のために残しており、できるだけ使われたくない
  .filter((v) => !isNaN(Number(v)))
  .sort() as Gap[]

export default {
  title: 'Components/Base/Groupbox',
  component: Groupbox,
  render: (args) => <Groupbox {...args} />,
  argTypes: {
    padding: {
      options: basePadding,
    },
    overflow: { control: false },
    as: { control: 'text' },
  },
  args: {
    children: 'ベースカラム',
  },
  parameters: {
    backgrounds: {
      values: [{ name: 'light', value: backgroundColorValue.white }],
    },
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof Groupbox>

export const Playground: StoryObj<typeof Groupbox> = {
  args: {},
}

export const Padding: StoryObj<typeof Groupbox> = {
  name: 'padding',
  render: (args) => (
    <Stack>
      {[undefined, ...basePadding].map((padding) => (
        <Groupbox {...args} padding={padding} key={padding}>
          padding: {padding}
        </Groupbox>
      ))}
      <Groupbox padding={{ block: 1, inline: 1.5 }}>
        padding: {'{{ block: 1, inline: 1.5 }}'}
      </Groupbox>
      <Groupbox padding={{ block: 1 }}>padding: {'{{ block: 1 }}'}</Groupbox>
    </Stack>
  ),
}

export const BgColor: StoryObj<typeof Groupbox> = {
  name: 'bgColor',
  render: (args) => (
    <Stack>
      {Object.keys(backgroundColor).map((bgColor) => (
        <Groupbox {...args} bgColor={bgColor as any} key={bgColor}>
          {bgColor}
        </Groupbox>
      ))}
    </Stack>
  ),
}
export const Rounded: StoryObj<typeof Groupbox> = {
  name: 'rounded',
  render: (args) => (
    <Stack>
      <Groupbox {...args}>rounded未指定</Groupbox>
      <Groupbox {...args} rounded={true}>
        rounded: true
      </Groupbox>
      <Groupbox {...args} rounded="all">
        rounded: all
      </Groupbox>
      <Groupbox {...args} rounded="top">
        rounded: top
      </Groupbox>
      <Groupbox {...args} rounded="right">
        rounded: right
      </Groupbox>
      <Groupbox {...args} rounded="bottom">
        rounded: bottom
      </Groupbox>
      <Groupbox {...args} rounded="left">
        rounded: left
      </Groupbox>
    </Stack>
  ),
}

export const As: StoryObj<typeof Groupbox> = {
  name: 'as',
  args: {
    as: 'section',
  },
}
