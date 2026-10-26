import { useState } from 'react'
import { action } from 'storybook/actions'

import { Button } from '../../Button'
import { DropZone } from '../DropZone'

import type { Meta, StoryObj } from '@storybook/react-vite'

export default {
  title: 'Components/DropZone',
  component: DropZone,
  render: (args) => <DropZone {...args} name="file" />,
  args: {
    onSelectFiles: action('onSelected'),
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

export const MultipleAppendable: StoryObj<typeof DropZone> = {
  name: 'multiple (appendable)',
  render: (args) => {
    const [files, setFiles] = useState<File[]>([])

    return (
      <DropZone
        {...args}
        name="file"
        multiple={{ appendable: true }}
        files={files}
        onSelectFiles={(e, newFiles) => {
          action('onSelected')(e, newFiles)
          setFiles(newFiles)
        }}
      >
        <ul>
          {files.map((file, index) => (
            <li key={index}>
              {file.name}
              <Button size="S" onClick={() => setFiles(files.filter((_, i) => i !== index))}>
                削除
              </Button>
            </li>
          ))}
        </ul>
      </DropZone>
    )
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

export const SelectButtonLabel: StoryObj<typeof DropZone> = {
  name: 'selectButtonLabel',
  args: {
    selectButtonLabel: 'Choose File',
    children: 'カスタムラベルのボタン',
  },
}
