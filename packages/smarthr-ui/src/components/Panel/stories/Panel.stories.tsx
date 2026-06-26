import { Stack } from '../../Layout'
import { BaseColumn } from '../BaseColumn'
import { Panel, panelClassNameGenerator } from '../Panel'

import type { Gap } from '../../../types'
import type { Meta, StoryObj } from '@storybook/react-webpack5'
import type { ComponentProps } from 'react'

const basePadding = Object.keys(panelClassNameGenerator.variants.paddingBlock)
  // Tシャツサイズは後方互換性のために残しており、できるだけ使われたくない
  .filter((v) => !isNaN(Number(v)))
  .sort() as Gap[]
const baseOverflow = [undefined, 'visible', 'hidden', 'clip', 'scroll', 'auto'] as const
const baseLayer = Object.keys(panelClassNameGenerator.variants.layer).map(Number) as Array<
  ComponentProps<typeof Panel>['layer']
>

export default {
  title: 'Components/Panel',
  component: Panel,
  subcomponents: { BaseColumn },
  render: (args) => <Panel {...args} />,
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
} as Meta<typeof Panel>

export const BaseControl: StoryObj<typeof Panel> = {
  name: 'Playground',
  args: {},
}

export const Padding: StoryObj<typeof Panel> = {
  name: 'padding',
  render: (args) => (
    <Stack>
      {[undefined, ...basePadding].map((padding) => (
        <Panel {...args} padding={padding} key={padding}>
          padding: {padding}
        </Panel>
      ))}
      <Panel padding={{ block: 1, inline: 1.5 }}>padding: {'{{ block: 1, inline: 1.5 }}'}</Panel>
      <Panel padding={{ block: 1 }}>padding: {'{{ block: 1 }}'}</Panel>
    </Stack>
  ),
}

export const Radius: StoryObj<typeof Panel> = {
  name: 'radius',
  render: (args) => (
    <Stack>
      <Panel {...args} radius="m">
        m
      </Panel>
      <Panel {...args} radius="s">
        s
      </Panel>
    </Stack>
  ),
}

export const Overflow: StoryObj<typeof Panel> = {
  name: 'overflow',
  render: (args) => (
    <Stack>
      {baseOverflow.map((overflow) => (
        <Panel {...args} overflow={overflow} key={overflow}>
          <p className="shr-bg-white">{overflow || 'undefined'}</p>
        </Panel>
      ))}
    </Stack>
  ),
}

export const Layer: StoryObj<typeof Panel> = {
  name: 'layer',
  render: (args) => (
    <Stack>
      {baseLayer.map((layer) => (
        <Panel {...args} layer={layer} key={layer}>
          layer: {layer}
        </Panel>
      ))}
    </Stack>
  ),
}

export const As: StoryObj<typeof Panel> = {
  name: 'as',
  args: {
    as: 'section',
  },
}
