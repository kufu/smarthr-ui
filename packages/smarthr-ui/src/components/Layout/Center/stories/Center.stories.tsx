
import { Center } from '..'
import { ColorBox } from '../../ComponentsForStories'
import { Stack } from '../../Stack'
import { centerClassNameGenerator } from '../Center'

import type { Gap as GapType } from '../../../../types'
import type { Meta, StoryObj } from '@storybook/react-webpack5'

const centerPadding = Object.keys(centerClassNameGenerator.variants.padding)
  // Tシャツサイズは後方互換性のために残しており、できるだけ使われたくない
  .filter((v) => !isNaN(Number(v)))
  .sort() as GapType[]

export default {
  title: 'Components/Layout/Center',
  component: Center,
  render: (args) => (
    <Center {...args}>
      <ColorBox />
    </Center>
  ),
  argTypes: {
    gap: {
      padding: centerPadding,
    },
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof Center>

export const Playground: StoryObj<typeof Center> = {}

export const Padding: StoryObj<typeof Center> = {
  name: 'padding',
  render: (args) => (
    <Stack>
      {centerPadding.map((padding) => (
        <Center {...args} padding={padding} className="shr-bg-background" key={padding}>
          <ColorBox />
        </Center>
      ))}
    </Stack>
  ),
}

export const VerticalCentering: StoryObj<typeof Center> = {
  name: 'verticalCentering',
  render: (args) => (
    <Stack className="shr-h-screen">
      <Center {...args} className="shr-h-1/2 shr-bg-background">
        <ColorBox />
      </Center>
      <Center {...args} verticalCentering className="shr-h-1/2 shr-bg-background">
        <ColorBox />
      </Center>
    </Stack>
  ),
}

export const MinHeight: StoryObj<typeof Center> = {
  name: 'minHeight',
  render: (args) => (
    <Center {...args} minHeight="20em" className="shr-bg-background">
      <ColorBox />
    </Center>
  ),
  args: {
    verticalCentering: true,
  },
}

export const MaxWidth: StoryObj<typeof Center> = {
  name: 'maxWidth',
  render: (args) => (
    <Center {...args} maxWidth="20em" className="shr-bg-background">
      <ColorBox />
    </Center>
  ),
}

export const As: StoryObj<typeof Center> = {
  name: 'as',
  args: {
    as: 'section',
  },
}
