
import { FaAddressBookIcon } from '../../Icon'
import { Stack } from '../../Layout'
import { Heading } from '../Heading'

import type { Meta, StoryObj } from '@storybook/react-webpack5'
import type { ComponentPropsWithoutRef } from 'react'

export default {
  title: 'Components/Heading',
  component: Heading,
  render: (args) => <Heading {...args}>Heading</Heading>,
  args: {},
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof Heading>

export const HeadingControl: StoryObj<typeof Heading> = {
  name: 'Playground',
  args: {},
}

export const Type: StoryObj<typeof Heading> = {
  name: 'type',
  render: (args: Omit<ComponentPropsWithoutRef<typeof Heading>, 'size'>) => (
    <Stack>
      <Heading {...args}>type未指定</Heading>
      <Heading {...args} type="sectionTitle">
        SectionTitle
      </Heading>
      <Heading {...args} type="blockTitle">
        BlockTitle
      </Heading>
      <Heading {...args} type="subBlockTitle">
        SubBlockTitle
      </Heading>
      <Heading {...args} type="subSubBlockTitle">
        SubSubBlockTitle
      </Heading>
    </Stack>
  ),
}

export const Size: StoryObj<typeof Heading> = {
  name: 'size',
  render: (args: Omit<ComponentPropsWithoutRef<typeof Heading>, 'type'>) => (
    <Stack>
      <Heading {...args} type="sectionTitle">
        SectionTitle (size未指定)
      </Heading>
      <Heading {...args} type="sectionTitle" size="XXL">
        SectionTitle XXL
      </Heading>
      <Heading {...args} type="sectionTitle" size="XL">
        SectionTitle XL
      </Heading>
      <Heading {...args} type="sectionTitle" size="L">
        SectionTitle L
      </Heading>
    </Stack>
  ),
}

export const Tag: StoryObj<typeof Heading> = {
  name: 'tag(非推奨)',
  render: (args) => (
    <Stack>
      <Heading {...args}>未指定(推奨)</Heading>
      <Heading {...args} tag="h1">
        h1
      </Heading>
      <Heading {...args} tag="h2">
        h2
      </Heading>
      <Heading {...args} tag="h3">
        h3
      </Heading>
      <Heading {...args} tag="h4">
        h4
      </Heading>
      <Heading {...args} tag="h5">
        h5
      </Heading>
      <Heading {...args} tag="h6">
        h6
      </Heading>
    </Stack>
  ),
}

export const VisuallyHidden: StoryObj<typeof Heading> = {
  name: 'visuallyHidden',
  render: (args) => (
    <Stack>
      <Heading {...args}>visuallyHidden未指定</Heading>
      <Heading {...args} visuallyHidden={true}>
        visuallyHidden=true
      </Heading>
      <Heading {...args} visuallyHidden={false}>
        visuallyHidden=false:
      </Heading>
    </Stack>
  ),
}

export const Icon: StoryObj<typeof Heading> = {
  name: 'icon',
  render: (args) => (
    <Heading {...args} icon={<FaAddressBookIcon />}>
      icon
    </Heading>
  ),
}
