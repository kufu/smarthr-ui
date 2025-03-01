import React from 'react'

import { UnstyledButton } from '../../Button'
import { FaCircleCheckIcon, FaCircleXmarkIcon } from '../../Icon'
import { Stack } from '../../Layout'
import { Chip } from '../Chip'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Data Display（データ表示）/Chip',
  component: Chip,
  render: (args) => <Chip {...args} />,
  argTypes: {
    size: {
      control: 'select',
    },
  },
  args: {
    children: 'ラベル',
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof Chip>

export const Playground: StoryObj<typeof Chip> = {
  args: {},
}

export const Size: StoryObj<typeof Chip> = {
  name: 'size',
  render: (args) => (
    <Stack align="flex-start">
      {[undefined, 's'].map((size) => (
        <Chip {...args} size={size as any} key={String(size)} />
      ))}
    </Stack>
  ),
}

export const Disabled: StoryObj<typeof Chip> = {
  name: 'disabled',
  args: {
    disabled: true,
  },
}

export const SuffixIcon: StoryObj<typeof Chip> = {
  name: 'suffixIcon',
  args: {
    children: (
      <span className="shr-inline-flex shr-gap-0.5 shr-items-center shr-mr-[-3px]">
        ラベル
        <FaCircleCheckIcon className="shr-align-bottom" />
      </span>
    ),
  },
}

export const SuffixIconButton: StoryObj<typeof Chip> = {
  name: 'suffixIconButton',
  args: {
    children: (
      <span className="shr-inline-flex shr-gap-0.5 shr-items-center shr-mr-[-3px]">
        ラベル
        <UnstyledButton className="shr-rounded-full shr-leading-none">
          <FaCircleXmarkIcon className="shr-align-bottom" />
        </UnstyledButton>
      </span>
    ),
  },
}
