import { action } from 'storybook/actions'

import { DropZone } from '../DropZone'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Components/DropZone',
  component: DropZone,
  render: (args) => <DropZone {...args} name="file" />,
  args: {
    onSelectFiles: (files) => action('onSelected')(files),
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof DropZone>

export const Playground: StoryObj<typeof DropZone> = {
  args: {},
}

export const Accept: StoryObj<typeof DropZone> = {
  name: 'accept',
  args: {
    accept: 'image/*',
    children: 'image/* のみアップロード可能',
  },
}

export const Multiple: StoryObj<typeof DropZone> = {
  name: 'multiple',
  args: {
    multiple: true,
    children: '複数ファイルアップロード可能',
  },
}

export const Disabled: StoryObj<typeof DropZone> = {
  name: 'disabled',
  args: {
    disabled: true,
  },
}

export const Error: StoryObj<typeof DropZone> = {
  name: 'error',
  args: {
    error: true,
  },
}

export const Decorators: StoryObj<typeof DropZone> = {
  name: 'decorators',
  args: {
    decorators: {
      selectButtonLabel: (txt) => `select file.(${txt})`,
    },
    children: 'ボタンのテキストを変更',
  },
}
