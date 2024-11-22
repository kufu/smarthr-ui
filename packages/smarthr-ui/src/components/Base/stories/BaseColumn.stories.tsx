import { background } from '@storybook/theming'
import React, { ComponentProps } from 'react'

import { backgroundColor } from '../../../themes'
import { Gap } from '../../../types'
import { Stack } from '../../Layout'
import { base } from '../Base'
import { BaseColumn } from '../BaseColumn'
import { baseColumn } from '../BaseColumn/BaseColumn'

import type { Meta, StoryObj } from '@storybook/react'

const basePadding = Object.keys(base.variants.paddingBlock)
  // Tシャツサイズは後方互換性のために残しており、できるだけ使われたくない
  .filter((v) => !isNaN(Number(v)))
  .sort() as Gap[]

export default {
  title: 'Data Display（データ表示）/Base/BaseColumn',
  component: BaseColumn,
  render: (args) => <BaseColumn {...args} />,
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
      values: [{ name: 'light', value: backgroundColor.white }],
    },
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof BaseColumn>

export const Playground: StoryObj<typeof BaseColumn> = {
  args: {},
}

export const Padding: StoryObj<typeof BaseColumn> = {
  name: 'padding',
  render: (args) => (
    <Stack>
      {[undefined, ...basePadding].map((padding) => (
        <BaseColumn {...args} padding={padding} key={padding}>
          padding: {padding}
        </BaseColumn>
      ))}
      <BaseColumn padding={{ block: 1, inline: 1.5 }}>
        padding: {'{{ block: 1, inline: 1.5 }}'}
      </BaseColumn>
      <BaseColumn padding={{ block: 1 }}>padding: {'{{ block: 1 }}'}</BaseColumn>
    </Stack>
  ),
}

export const BgColor: StoryObj<typeof BaseColumn> = {
  name: 'bgColor',
  render: (args) => (
    <Stack>
      {Object.keys(baseColumn.variants.bgColor).map((bgColor) => (
        <BaseColumn {...args} bgColor={bgColor as any} key={bgColor}>
          {bgColor}
        </BaseColumn>
      ))}
    </Stack>
  ),
}

export const As: StoryObj<typeof BaseColumn> = {
  name: 'as',
  args: {
    as: 'section',
  },
}
