import { useState } from 'react'

import { FormControl } from '../../../FormControl'
import { Stack } from '../../../Layout'
import { Text } from '../../../Text'
import { FlexibleRichTextEditor } from '../FlexibleRichTextEditor'

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
  title: 'Components/RichTextEditor/FlexibleRichTextEditor',
  component: FlexibleRichTextEditor,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof FlexibleRichTextEditor>

export default meta
type Story = StoryObj<typeof meta>

export const HTMLInputHTMLOutput: Story = {
  name: 'HTML入力 → HTML出力',
  render: () => {
    const [output, setOutput] = useState<string>('')
    return (
      <Stack>
        <FormControl
          label="HTML入力・HTML出力"
          helpMessage="content={{ format: 'html', content: '...' }} と outputFormat='html' を組み合わせた例です。既存のHTMLデータをそのまま編集し、HTML形式で取得できます。"
        >
          <FlexibleRichTextEditor
            features={ALL_FEATURES}
            content={{
              format: 'html',
              content: '<p>既存の<strong>HTML</strong>コンテンツです。</p>',
            }}
            outputFormat="html"
            onChange={(value) => setOutput(value as string)}
          />
        </FormControl>
        <details>
          <summary>HTML出力</summary>
          <pre style={{ fontSize: 12 }}>{output}</pre>
        </details>
      </Stack>
    )
  },
}

export const JSONInputJSONOutput: Story = {
  name: 'JSON入力 → JSON出力',
  render: () => {
    const [output, setOutput] = useState<RichTextJSON | undefined>()
    return (
      <Stack>
        <FormControl
          label="JSON入力・JSON出力"
          helpMessage="content={{ format: 'json', content: {...} }} と outputFormat='json'（デフォルト）を組み合わせた例です。"
        >
          <FlexibleRichTextEditor
            features={ALL_FEATURES}
            content={{
              format: 'json',
              content: {
                type: 'doc',
                content: [
                  {
                    type: 'paragraph',
                    content: [{ type: 'text', text: 'JSONコンテンツです。' }],
                  },
                ],
              },
            }}
            onChange={(value) => setOutput(value as RichTextJSON)}
          />
        </FormControl>
        <details>
          <summary>JSON出力</summary>
          <pre style={{ fontSize: 12 }}>{JSON.stringify(output, null, 2)}</pre>
        </details>
      </Stack>
    )
  },
}

export const HTMLInputJSONOutput: Story = {
  name: 'HTML入力 → JSON出力',
  render: () => {
    const [output, setOutput] = useState<RichTextJSON | undefined>()
    return (
      <Stack>
        <FormControl
          label="HTML入力・JSON出力"
          helpMessage="既存のHTMLデータを読み込み、編集後はJSON形式で取得する例です。HTMLからJSONへのマイグレーションに便利です。"
        >
          <FlexibleRichTextEditor
            features={ALL_FEATURES}
            content={{
              format: 'html',
              content:
                '<h2>既存HTML</h2><p>このデータは<em>HTML形式</em>で保存されていました。</p><ul><li>項目1</li><li>項目2</li></ul>',
            }}
            outputFormat="json"
            onChange={(value) => setOutput(value as RichTextJSON)}
          />
        </FormControl>
        <details>
          <summary>JSON出力</summary>
          <pre style={{ fontSize: 12 }}>{JSON.stringify(output, null, 2)}</pre>
        </details>
      </Stack>
    )
  },
}

export const EmptyContent: Story = {
  name: '空コンテンツ（新規作成）',
  render: () => {
    const [output, setOutput] = useState<RichTextJSON | undefined>()
    return (
      <Stack>
        <FormControl
          label="空コンテンツ"
          helpMessage="content={{ format: 'empty' }} で初期値なしの新規作成モードです。"
        >
          <FlexibleRichTextEditor
            features={ALL_FEATURES}
            content={{ format: 'empty' }}
            placeholder="何か入力してください"
            onChange={(value) => setOutput(value as RichTextJSON)}
          />
        </FormControl>
        <details>
          <summary>JSON出力</summary>
          <pre style={{ fontSize: 12 }}>{JSON.stringify(output, null, 2)}</pre>
        </details>
      </Stack>
    )
  },
}

export const ContentVsValuePrecedence: Story = {
  name: 'defaultValue と content の優先順位',
  render: () => (
    <Stack>
      <FormControl
        label="defaultValue が優先される"
        helpMessage="defaultValue と content の両方を渡した場合、defaultValue が優先されます。"
      >
        <FlexibleRichTextEditor
          defaultValue={{
            type: 'doc',
            content: [
              {
                type: 'paragraph',
                content: [
                  { type: 'text', text: 'defaultValue の内容が表示されます（content より優先）' },
                ],
              },
            ],
          }}
          content={{
            format: 'html',
            content: '<p>この content は無視されます</p>',
          }}
        />
      </FormControl>
      <FormControl
        label="content のみ"
        helpMessage="defaultValue を渡さず content のみの場合、content がJSON正規化されて初期値になります。"
      >
        <FlexibleRichTextEditor
          content={{
            format: 'html',
            content: '<p>content の内容が表示されます</p>',
          }}
        />
      </FormControl>
    </Stack>
  ),
}
