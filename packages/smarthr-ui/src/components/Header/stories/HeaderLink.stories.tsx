import { FaRegCircleQuestionIcon } from '../../Icon'
import { HeaderLink } from '../HeaderLink'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

export default {
  title: 'Components/Header/HeaderLink',
  component: HeaderLink,
  render: (args) => <HeaderLink {...args}>ヘルプ</HeaderLink>,
  args: {
    href: '#',
  },
  globals: { backgrounds: { value: 'brand' } },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof HeaderLink>

export const Playground: StoryObj<typeof HeaderLink> = {
  args: {},
}

export const Prefix: StoryObj<typeof HeaderLink> = {
  name: 'prefix',
  args: {
    prefix: <FaRegCircleQuestionIcon />,
  },
}

export const EnableNew: StoryObj<typeof HeaderLink> = {
  name: 'enableNew',
  render: (args) => <HeaderLink {...args}>ヘルプ</HeaderLink>,
  args: {
    prefix: <FaRegCircleQuestionIcon />,
    enableNew: true,
  },
  globals: { backgrounds: { value: 'white' } },
}
