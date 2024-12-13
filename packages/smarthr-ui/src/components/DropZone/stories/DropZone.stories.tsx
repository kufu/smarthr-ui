import { action } from '@storybook/addon-actions'
import React from 'react'

import { DropZone } from '../DropZone'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Forms（フォーム）/DropZone',
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

export const Decorators: StoryObj<typeof DropZone> = {
  name: 'decorators',
  args: {
    decorators: {
      selectButtonLabel: (txt) => `select file.(${txt})`,
    },
    children: 'ボタンのテキストを変更',
  },
}
