import { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { Cluster } from '..'
import { Gap as GapType } from '../../../../types'
import { ColorBox } from '../../ComponentsForStories'
import { Stack } from '../../Stack'
import { cluster } from '../Cluster'

const clusterGap = Object.keys(cluster.variants.rowGap)
  // Tシャツサイズは後方互換性のために残しており、できるだけ使われたくない
  .filter((v) => !isNaN(Number(v)))
  .sort() as GapType[]

export default {
  title: 'Layouts（レイアウト）/Cluster',
  component: Cluster,
  render: (args) => (
    <Cluster {...args}>
      {[...Array(20)].map((_, i) => (
        <ColorBox key={i} />
      ))}
    </Cluster>
  ),
  argTypes: {
    gap: {
      options: clusterGap,
    },
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof Cluster>

export const Playground: StoryObj<typeof Cluster> = {}

export const Inline: StoryObj<typeof Cluster> = {
  name: 'inline',
  args: {
    inline: true,
  },
}

export const Gap: StoryObj<typeof Cluster> = {
  name: 'gap',
  render: (args) => (
    <Stack>
      {clusterGap.map((gap) => (
        <Cluster {...args} gap={gap} key={gap}>
          {[...Array(3)].map((_, i) => (
            <ColorBox key={i} />
          ))}
        </Cluster>
      ))}
    </Stack>
  ),
}

export const SeparateGap: StoryObj<typeof Cluster> = {
  name: 'gap（row と column で異なる値）',
  render: (args) => (
    <Cluster {...args} gap={{ column: 1.25, row: 0.5 }}>
      {[...Array(20)].map((_, i) => (
        <ColorBox key={i} />
      ))}
    </Cluster>
  ),
}

export const Align: StoryObj<typeof Cluster> = {
  name: 'align',
  render: (args) => (
    <Stack>
      {Object.keys(cluster.variants.align).map((align) => (
        <Cluster
          {...args}
          align={align as any}
          className="shr-bg-background shr-h-[160px]"
          key={align}
        >
          {[...Array(3)].map((_, i) => (
            <ColorBox key={i} />
          ))}
        </Cluster>
      ))}
    </Stack>
  ),
}

export const Justify: StoryObj<typeof Cluster> = {
  name: 'justify',
  render: (args) => (
    <Stack>
      {Object.keys(cluster.variants.justify).map((justify) => (
        <Cluster
          {...args}
          justify={justify as any}
          className="shr-bg-background shr-h-[160px]"
          key={justify}
        >
          {[...Array(3)].map((_, i) => (
            <ColorBox key={i} />
          ))}
        </Cluster>
      ))}
    </Stack>
  ),
}

export const As: StoryObj<typeof Cluster> = {
  name: 'as',
  args: {
    as: 'section',
  },
}
