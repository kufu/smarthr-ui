import React from 'react'

import { Stack } from '../../Layout'
import { Text } from '../Text'

import type { Meta, StoryObj } from '@storybook/react'

const asOptions = { なし: undefined, '<p>': 'p', '<h1>': 'h1' }

export default {
  title: 'Text（テキスト）/Text',
  component: Text,
  render: (args) => <Text {...args} />,
  argTypes: {
    as: {
      control: 'radio',
      options: Object.keys(asOptions),
      mapping: asOptions,
    },
  },
  args: {
    children: 'well-working 労働にまつわる社会課題をなくし、誰もがその人らしく働ける社会をつくる。',
    italic: false,
    emphasis: false,
    as: 'なし',
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof Text>

export const TextControl: StoryObj<typeof Text> = {
  name: 'Playground',
}

export const Size: StoryObj<typeof Text> = {
  name: 'size',
  render: (args) => (
    <Stack>
      <Text {...args} size="XXS" />
      <Text {...args} size="XS" />
      <Text {...args} size="S" />
      <Text {...args} size="M" />
      <Text {...args} size="L" />
      <Text {...args} size="XL" />
      <Text {...args} size="XXL" />
    </Stack>
  ),
}

export const Weight: StoryObj<typeof Text> = {
  name: 'weight',
  render: (args) => (
    <Stack>
      <Text {...args} weight="normal" />
      <Text {...args} weight="bold" />
    </Stack>
  ),
}

export const Color: StoryObj<typeof Text> = {
  name: 'color',
  render: (args) => (
    <Stack>
      <Text {...args} color="TEXT_BLACK" />
      <Text {...args} color="TEXT_WHITE" className="shr-bg-black" />
      <Text {...args} color="TEXT_GREY" />
      <Text {...args} color="TEXT_DISABLED" />
      <Text {...args} color="TEXT_LINK" />
      <Text {...args} color="inherit" />
    </Stack>
  ),
}

export const Italic: StoryObj<typeof Text> = {
  name: 'italic',
  args: {
    italic: true,
  },
}

export const Leading: StoryObj<typeof Text> = {
  name: 'leading',
  render: (args) => (
    <Stack>
      <Text {...args} leading="NONE" />
      <Text {...args} leading="TIGHT" />
      <Text {...args} leading="NORMAL" />
      <Text {...args} leading="LOOSE" />
    </Stack>
  ),
}

export const WhiteSpace: StoryObj<typeof Text> = {
  name: 'whiteSpace',
  render: (args) => (
    <Stack gap={3} className="shr-w-[10em]">
      <Text {...args} whiteSpace="normal" />
      <Text {...args} whiteSpace="nowrap" />
      <Text {...args} whiteSpace="pre" />
      <Text {...args} whiteSpace="pre-line" />
      <Text {...args} whiteSpace="pre-wrap" />
    </Stack>
  ),
  args: {
    children:
      'well-working\n\n労働にまつわる社会課題をなくし、誰もがその人らしく働ける社会をつくる。',
  },
}

export const Emphasis: StoryObj<typeof Text> = {
  name: 'emphasis',
  args: {
    emphasis: true,
  },
}

export const StyleType: StoryObj<typeof Text> = {
  name: 'styleType',
  args: {
    weight: undefined,
  },
  render: (args) => (
    <Stack>
      <Text {...args} styleType="screenTitle" />
      <Text {...args} styleType="sectionTitle" />
      <Text {...args} styleType="blockTitle" />
      <Text {...args} styleType="subBlockTitle" />
      <Text {...args} styleType="subSubBlockTitle" />
    </Stack>
  ),
}

export const As: StoryObj<typeof Text> = {
  name: 'as',
  render: (args) => (
    <Stack>
      <Text {...args} as="h1" />
      <Text {...args} as="p" />
    </Stack>
  ),
}
