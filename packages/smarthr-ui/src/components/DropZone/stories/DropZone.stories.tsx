import { useState } from 'react'
import { action } from 'storybook/actions'

import { DropZone } from '../DropZone'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

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

export const SelectButtonLabel: StoryObj<typeof DropZone> = {
  name: 'selectButtonLabel',
  args: {
    selectButtonLabel: 'Choose File',
    children: 'カスタムラベルのボタン',
  },
}

export const MultipleAppendable: StoryObj<typeof DropZone> = {
  name: 'multiple (appendable)',
  render: () => {
    const [files, setFiles] = useState<File[]>([])

    return (
      <DropZone
        name="file"
        multiple={{ appendable: true }}
        files={files}
        onSelectFiles={(_, newFiles) => {
          action('onSelectFiles')(newFiles)
          setFiles(newFiles)
        }}
      >
        {files.length > 0 && (
          <ul>
            {files.map((f) => (
              <li key={f.name}>
                {f.name}
                <button type="button" onClick={() => setFiles(files.filter((x) => x !== f))}>
                  削除
                </button>
              </li>
            ))}
          </ul>
        )}
      </DropZone>
    )
  },
}
