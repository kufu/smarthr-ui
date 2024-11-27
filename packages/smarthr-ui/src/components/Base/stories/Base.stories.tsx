import React, { ComponentProps } from 'react'

import { Gap } from '../../../types'
import { Stack } from '../../Layout'
import { Base, base } from '../Base'
import { BaseColumn } from '../BaseColumn'

import type { Meta, StoryObj } from '@storybook/react'

const basePadding = Object.keys(base.variants.paddingBlock)
  // Tシャツサイズは後方互換性のために残しており、できるだけ使われたくない
  .filter((v) => !isNaN(Number(v)))
  .sort() as Gap[]
const baseOverflow = [undefined, 'visible', 'hidden', 'clip', 'scroll', 'auto'] as const
const baseLayer = Object.keys(base.variants.layer).map(Number) as Array<
  ComponentProps<typeof Base>['layer']
>

export default {
  title: 'Data Display（データ表示）/Base',
  component: Base,
  subcomponents: { BaseColumn },
  render: (args) => <Base {...args} />,
  argTypes: {
    padding: {
      options: basePadding,
    },
    overflow: {
      options: baseOverflow,
    },
    as: { control: 'text' },
  },
  args: {
    children: <div className="shr-h-2" />,
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof Base>

export const BaseControl: StoryObj<typeof Base> = {
  name: 'Playground',
  args: {},
}

export const Padding: StoryObj<typeof Base> = {
  name: 'padding',
  render: (args) => (
    <Stack>
      {[undefined, ...basePadding].map((padding) => (
        <Base {...args} padding={padding} key={padding}>
          padding: {padding}
        </Base>
      ))}
      <Base padding={{ block: 1, inline: 1.5 }}>padding: {'{{ block: 1, inline: 1.5 }}'}</Base>
      <Base padding={{ block: 1 }}>padding: {'{{ block: 1 }}'}</Base>
    </Stack>
  ),
}

export const Radius: StoryObj<typeof Base> = {
  name: 'radius',
  render: (args) => (
    <Stack>
      <Base {...args} radius="m">
        m
      </Base>
      <Base {...args} radius="s">
        s
      </Base>
    </Stack>
  ),
}

export const Overflow: StoryObj<typeof Base> = {
  name: 'overflow',
  render: (args) => (
    <Stack>
      {baseOverflow.map((overflow) => (
        <Base {...args} overflow={overflow} key={overflow}>
          <p className="shr-bg-white">{overflow || 'undefined'}</p>
        </Base>
      ))}
    </Stack>
  ),
}

export const Layer: StoryObj<typeof Base> = {
  name: 'layer',
  render: (args) => (
    <Stack>
      {baseLayer.map((layer) => (
        <Base {...args} layer={layer} key={layer}>
          layer: {layer}
        </Base>
      ))}
    </Stack>
  ),
}

export const As: StoryObj<typeof Base> = {
  name: 'as',
  args: {
    as: 'section',
  },
}
