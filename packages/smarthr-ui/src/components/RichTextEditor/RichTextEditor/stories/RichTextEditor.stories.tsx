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
  'color',
  'backgroundColor',
  'image',
  'youtube',
  'fontSize',
  'textAlign',
  'table',
] as const

const mockImageUpload = async (file: File) => {
  await new Promise((resolve) => setTimeout(resolve, 5000))
  return { src: URL.createObjectURL(file), alt: file.name }
}

const mockImageUploadError = (error: unknown, file: File) => {
  console.error('image upload failed:', file.name, error)
}

const meta = {
  title: 'Components/RichTextEditor/RichTextEditor',
  component: RichTextEditor,
  render: ({ outputFormat: _, onChange: __, ...rest }) => (
    <FormControl label="リッチテキストエディタ">
      <RichTextEditor {...rest} />
    </FormControl>
  ),
  args: {
    features: ALL_FEATURES,
  },
  argTypes: {
    disabled: { description: '非活性', type: 'boolean' },
    readOnly: { description: '読み取り専用', type: 'boolean' },
    error: { description: 'エラー状態', type: 'boolean' },
    hideToolbar: { description: 'ツールバー非表示', type: 'boolean' },
  },
  parameters: {
    layout: 'padded',
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof RichTextEditor>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: ({ outputFormat: _, onChange: __, ...rest }) => {
    const [value, setValue] = useState<RichTextJSON | undefined>()
    return (
      <Stack>
        <FormControl label="リッチテキストエディタ">
          <RichTextEditor
            {...rest}
            onChange={(json) => setValue(json)}
            onImageUpload={mockImageUpload}
            onImageUploadError={mockImageUploadError}
            placeholder="ここに本文を入力してください"
            showCharacterCount
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
  args: {
    placeholder: '全機能が有効です',
  },
}

export const Controlled: Story = {
  render: ({ outputFormat: _, onChange: __, ...rest }) => {
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
        <RichTextEditor {...rest} value={value} onChange={(json) => setValue(json)} />
      </FormControl>
    )
  },
}

export const Uncontrolled: Story = {
  args: {
    defaultValue: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Default content' }],
        },
      ],
    },
  },
}

export const ReadOnly: Story = {
  name: 'readOnly',
  args: {
    readOnly: true,
    defaultValue: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'This is ' },
            { type: 'text', marks: [{ type: 'bold' }], text: 'read only' },
            { type: 'text', text: ' content.' },
          ],
        },
      ],
    },
  },
}

export const Disabled: Story = {
  name: 'disabled',
  args: {
    disabled: true,
    placeholder: '編集できません',
  },
}

export const WithError: Story = {
  name: 'error',
  render: ({ outputFormat: _, onChange: __, ...rest }) => (
    <FormControl label="エラー状態" errorMessages="入力内容にエラーがあります">
      <RichTextEditor {...rest} />
    </FormControl>
  ),
  args: {
    error: true,
    placeholder: 'エラーがあります',
  },
}

export const MinimalFeatures: Story = {
  args: {
    features: [],
    placeholder: 'テキストを入力',
  },
}

export const ImageEditing: Story = {
  name: '画像編集（フローティングツールバー）',
  render: ({ outputFormat: _, onChange: __, ...rest }) => (
    <FormControl label="画像編集">
      <RichTextEditor
        {...rest}
        features={['image', 'bold']}
        defaultValue={{
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                { type: 'text', text: '画像をクリックすると上部に操作バーが表示されます。' },
              ],
            },
            {
              type: 'image',
              attrs: { src: 'https://placehold.co/400x300.png', alt: 'サンプル画像' },
            },
            { type: 'paragraph' },
          ],
        }}
        onImageUpload={mockImageUpload}
        onImageUploadError={mockImageUploadError}
      />
    </FormControl>
  ),
}

export const ColorPickerWithExistingContent: Story = {
  name: 'カラーピッカー: 既存コンテンツの色読み込み',
  args: {
    content: {
      format: 'html',
      content:
        '<p>色付きテキストを選択してカラーピッカー(A)を開くと、現在の色が反映されます。</p>' +
        '<p><span style="color: rgb(255, 0, 0)">rgb()形式の赤</span>(rgb(255, 0, 0) → #ff0000 として読み込まれる)</p>' +
        '<p><span style="color: #fff">#fff 短縮形式 (背景白なので見えませんが、3桁hex → #ffffff として読み込まれる)</span></p>' +
        '<p><span style="color: #e01e5a">標準パレットの赤 (#e01e5a)</span> — 標準スウォッチにチェックが出る</p>' +
        '<p><span style="color: #ff6600">標準にない橙 (#ff6600)</span> — カスタムスウォッチにチェックが出る</p>' +
        '<p><span style="color: rgb(114, 57, 179)">標準と一致するrgb (#7239b3 紫)</span> — 標準スウォッチにチェックが出る</p>',
    },
  },
}

export const BackgroundColorPickerWithExistingContent: Story = {
  name: '背景色ピッカー: 既存コンテンツの背景色読み込み',
  args: {
    content: {
      format: 'html',
      content:
        '<p>背景色付きテキストを選択して背景色ピッカー(ハイライト)を開くと、現在の色が反映されます。</p>' +
        '<p><span style="background-color: #fbf3c4">黄色ハイライト (#fbf3c4) — 標準パレットにチェックが出る</span></p>' +
        '<p><span style="background-color: #d2e9f5">水色ハイライト (#d2e9f5) — 標準パレットにチェックが出る</span></p>' +
        '<p><span style="background-color: #ff9900">標準にない橙 (#ff9900) — カスタムスウォッチにチェックが出る</span></p>' +
        '<p><span style="background-color: #fbf3c4"><span style="color: #e01e5a">背景色と文字色の組み合わせ</span></span></p>',
    },
  },
}

export const HTMLIntegration: Story = {
  name: 'HTML入出力',
  render: ({ outputFormat: _, onChange: __, ...rest }) => {
    const [output, setOutput] = useState('')
    return (
      <Stack>
        <FormControl label="HTML入力 → HTML出力">
          <RichTextEditor
            {...rest}
            content={{
              format: 'html',
              content:
                '<h2>既存のHTML</h2><p>このデータは<strong>HTML形式</strong>で保存されていました。</p><ul><li>項目1</li><li>項目2</li></ul>',
            }}
            outputFormat="html"
            onChange={(value) => setOutput(value)}
          />
        </FormControl>
        {output && (
          <details>
            <summary>HTML出力</summary>
            <pre style={{ fontSize: 12 }}>{output}</pre>
          </details>
        )}
      </Stack>
    )
  },
}

export const WithCharacterCount: Story = {
  name: '文字数カウント（showCharacterCount）',
  args: {
    showCharacterCount: true,
    placeholder: '入力すると下部に文字数が表示されます',
  },
}

export const CustomHeadingLevels: Story = {
  name: '見出しレベル制限（headingLevels）',
  render: ({ outputFormat: _, onChange: __, ...rest }) => (
    <Stack gap={1.5}>
      <FormControl label="H2〜H4のみ（H1なし）">
        <RichTextEditor
          {...rest}
          headingLevels={[2, 3, 4]}
          placeholder="見出しドロップダウンにH1が表示されません"
        />
      </FormControl>
      <FormControl label="H1〜H2のみ">
        <RichTextEditor
          {...rest}
          headingLevels={[1, 2]}
          placeholder="見出しドロップダウンにH1とH2のみ表示されます"
        />
      </FormControl>
    </Stack>
  ),
  args: {
    features: ['bold', 'italic', 'heading', 'bulletList', 'orderedList', 'link'],
  },
}
