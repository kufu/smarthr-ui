import { useState } from 'react'

import { FormControl } from '../../../FormControl'
import { Stack } from '../../../Layout'
import { RichTextEditor } from '../RichTextEditor'

import type { RichTextJSON } from '../../types'
import type { Meta, StoryObj } from '@storybook/react-vite'

const ALL_FEATURES = [
  'bold',
  'italic',
  'underline',
  'strike',
  'code',
  'heading',
  'bulletList',
  'orderedList',
  'blockquote',
  'codeBlock',
  'horizontalRule',
  'link',
] as const

const meta = {
  title: 'Components/RichTextEditor/RichTextEditor',
  component: RichTextEditor,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof RichTextEditor>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: () => {
    const [value, setValue] = useState<RichTextJSON | undefined>()
    return (
      <Stack>
        <FormControl label="リッチテキストエディタ">
          <RichTextEditor
            features={ALL_FEATURES}
            onChange={(json) => setValue(json)}
            placeholder="ここに本文を入力してください"
          />
        </FormControl>
        <details>
          <summary>JSON出力</summary>
          <pre style={{ fontSize: 12 }}>{JSON.stringify(value, null, 2)}</pre>
        </details>
      </Stack>
    )
  },
}

export const AllFeatures: Story = {
  render: () => (
    <FormControl
      label={{
        text: '全機能が有効です',
        unrecommendedHide: true,
      }}
    >
      <RichTextEditor features={ALL_FEATURES} placeholder="全機能が有効です" />
    </FormControl>
  ),
}

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState<RichTextJSON>({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Controlled content' }],
        },
      ],
    })
    return (
      <FormControl label="Controlled">
        <RichTextEditor value={value} onChange={(json) => setValue(json)} />
      </FormControl>
    )
  },
}

export const Uncontrolled: Story = {
  render: () => (
    <FormControl label="Uncontrolled">
      <RichTextEditor
        defaultValue={{
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: 'Default content' }],
            },
          ],
        }}
      />
    </FormControl>
  ),
}

export const ReadOnly: Story = {
  render: () => (
    <FormControl label="ReadOnly">
      <RichTextEditor
        readOnly
        defaultValue={{
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                { type: 'text', text: 'This is ' },
                {
                  type: 'text',
                  marks: [{ type: 'bold' }],
                  text: 'read only',
                },
                { type: 'text', text: ' content.' },
              ],
            },
          ],
        }}
      />
    </FormControl>
  ),
}

export const Disabled: Story = {
  render: () => (
    <FormControl label="Disabled">
      <RichTextEditor disabled placeholder="編集できません" />
    </FormControl>
  ),
}

export const WithError: Story = {
  render: () => (
    <FormControl label="エラー状態" errorMessages="入力内容にエラーがあります">
      <RichTextEditor error placeholder="エラーがあります" />
    </FormControl>
  ),
}

export const MinimalFeatures: Story = {
  render: () => (
    <FormControl label="MinimalFeatures">
      <RichTextEditor features={[]} placeholder="テキストを入力" />
    </FormControl>
  ),
}

export const FixedHeight: Story = {
  name: '高さ固定（editorClassName）',
  render: () => (
    <FormControl label="高さ固定">
      <RichTextEditor
        features={ALL_FEATURES}
        editorClassName="[&_.ProseMirror]:shr-h-[200px]"
        placeholder="高さ200pxで固定。内容が溢れたらスクロールします"
      />
    </FormControl>
  ),
}
