import { within } from 'storybook/test'

import { EnvironmentProvider } from '../../../../hooks/useEnvironment'
import { FormControl } from '../../../FormControl'
import { Stack } from '../../../Layout'
import { RichTextEditor } from '../RichTextEditor'

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
  'fontSize',
  'lineHeight',
  'textAlign',
  'image',
  'youtube',
  'table',
] as const

const richContent = {
  type: 'doc' as const,
  content: [
    {
      type: 'heading',
      attrs: { level: 1 },
      content: [{ type: 'text', text: '見出し1' }],
    },
    {
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: '見出し2' }],
    },
    {
      type: 'heading',
      attrs: { level: 3 },
      content: [{ type: 'text', text: '見出し3' }],
    },
    {
      type: 'heading',
      attrs: { level: 4 },
      content: [{ type: 'text', text: '見出し4' }],
    },
    {
      type: 'paragraph',
      content: [
        { type: 'text', text: '通常テキスト ' },
        { type: 'text', marks: [{ type: 'bold' }], text: '太字' },
        { type: 'text', text: ' ' },
        { type: 'text', marks: [{ type: 'italic' }], text: '斜体' },
        { type: 'text', text: ' ' },
        { type: 'text', marks: [{ type: 'underline' }], text: '下線' },
        { type: 'text', text: ' ' },
        { type: 'text', marks: [{ type: 'strike' }], text: '打ち消し' },
        { type: 'text', text: ' ' },
        { type: 'text', marks: [{ type: 'code' }], text: 'code' },
      ],
    },
    {
      type: 'bulletList',
      content: [
        {
          type: 'listItem',
          content: [{ type: 'paragraph', content: [{ type: 'text', text: '箇条書き1' }] }],
        },
        {
          type: 'listItem',
          content: [{ type: 'paragraph', content: [{ type: 'text', text: '箇条書き2' }] }],
        },
      ],
    },
    {
      type: 'orderedList',
      content: [
        {
          type: 'listItem',
          content: [{ type: 'paragraph', content: [{ type: 'text', text: '番号1' }] }],
        },
        {
          type: 'listItem',
          content: [{ type: 'paragraph', content: [{ type: 'text', text: '番号2' }] }],
        },
      ],
    },
    {
      type: 'blockquote',
      content: [{ type: 'paragraph', content: [{ type: 'text', text: '引用テキスト' }] }],
    },
    {
      type: 'codeBlock',
      content: [{ type: 'text', text: 'const x = 1' }],
    },
    { type: 'horizontalRule' },
    {
      type: 'table',
      content: [
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableHeader',
              content: [{ type: 'paragraph', content: [{ type: 'text', text: '列1' }] }],
            },
            {
              type: 'tableHeader',
              content: [{ type: 'paragraph', content: [{ type: 'text', text: '列2' }] }],
            },
          ],
        },
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableCell',
              content: [{ type: 'paragraph', content: [{ type: 'text', text: 'セル1' }] }],
            },
            {
              type: 'tableCell',
              content: [{ type: 'paragraph', content: [{ type: 'text', text: 'セル2' }] }],
            },
          ],
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          marks: [{ type: 'link', attrs: { href: 'https://example.com' } }],
          text: 'リンク',
        },
      ],
    },
    {
      type: 'paragraph',
      attrs: { textAlign: 'center' },
      content: [{ type: 'text', text: '中央揃えテキスト' }],
    },
    {
      type: 'paragraph',
      attrs: { textAlign: 'right' },
      content: [{ type: 'text', text: '右揃えテキスト' }],
    },
    {
      type: 'paragraph',
      attrs: { textAlign: 'justify' },
      content: [
        {
          type: 'text',
          text: '両端揃えテキスト。テキスト配置の確認用に十分な長さのテキストを入れています。両端揃えでは行の左右が均等に揃います。',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        { type: 'text', text: '背景色の例: ' },
        {
          type: 'text',
          marks: [{ type: 'textStyle', attrs: { backgroundColor: '#fbf3c4' } }],
          text: '黄色ハイライト',
        },
        { type: 'text', text: '・' },
        {
          type: 'text',
          marks: [{ type: 'textStyle', attrs: { backgroundColor: '#d2e9f5' } }],
          text: '水色ハイライト',
        },
        { type: 'text', text: '・' },
        {
          type: 'text',
          marks: [{ type: 'textStyle', attrs: { color: '#e01e5a', backgroundColor: '#fbf3c4' } }],
          text: '背景色と文字色の組み合わせ',
        },
      ],
    },
  ],
}

const meta = {
  title: 'Components/RichTextEditor/RichTextEditor/VRT',
  component: RichTextEditor,
  tags: ['!autodocs'],
  parameters: {
    chromatic: { disableSnapshot: false },
    layout: 'padded',
  },
} satisfies Meta<typeof RichTextEditor>

export default meta
type Story = StoryObj<typeof meta>

export const AllStates: Story = {
  render: () => (
    <Stack gap={2}>
      <FormControl label="通常">
        <RichTextEditor features={ALL_FEATURES} defaultValue={richContent} />
      </FormControl>
      <FormControl label="読み取り専用">
        <RichTextEditor features={ALL_FEATURES} readOnly defaultValue={richContent} />
      </FormControl>
      <FormControl label="無効">
        <RichTextEditor features={ALL_FEATURES} disabled defaultValue={richContent} />
      </FormControl>
      <FormControl label="エラー" errorMessages="入力内容にエラーがあります">
        <RichTextEditor features={ALL_FEATURES} error defaultValue={richContent} />
      </FormControl>
    </Stack>
  ),
}

const backgroundColorContent = {
  type: 'doc' as const,
  content: [
    {
      type: 'paragraph',
      content: [
        { type: 'text', text: '背景色の例: ' },
        {
          type: 'text',
          marks: [{ type: 'textStyle', attrs: { backgroundColor: '#fbf3c4' } }],
          text: '黄色ハイライト',
        },
        { type: 'text', text: '・' },
        {
          type: 'text',
          marks: [{ type: 'textStyle', attrs: { backgroundColor: '#d2e9f5' } }],
          text: '水色ハイライト',
        },
        { type: 'text', text: '・' },
        {
          type: 'text',
          marks: [{ type: 'textStyle', attrs: { backgroundColor: '#f5d6e6' } }],
          text: 'ピンクハイライト',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        { type: 'text', text: '文字色との組み合わせ: ' },
        {
          type: 'text',
          marks: [{ type: 'textStyle', attrs: { color: '#e01e5a', backgroundColor: '#fbf3c4' } }],
          text: '赤字 + 黄色背景',
        },
        { type: 'text', text: '・' },
        {
          type: 'text',
          marks: [{ type: 'textStyle', attrs: { color: '#0077c7', backgroundColor: '#d2e9f5' } }],
          text: '青字 + 水色背景',
        },
      ],
    },
  ],
}

export const BackgroundColor: Story = {
  name: '背景色ハイライト',
  render: () => (
    <Stack gap={2}>
      <FormControl label="背景色付きコンテンツ（通常）">
        <RichTextEditor
          features={['color', 'backgroundColor']}
          defaultValue={backgroundColorContent}
        />
      </FormControl>
      <FormControl label="背景色付きコンテンツ（読み取り専用）">
        <RichTextEditor
          features={['color', 'backgroundColor']}
          readOnly
          defaultValue={backgroundColorContent}
        />
      </FormControl>
    </Stack>
  ),
}

const imageWithWidthContent = {
  type: 'doc' as const,
  content: [
    {
      type: 'paragraph',
      content: [{ type: 'text', text: '幅・高さを指定した画像:' }],
    },
    {
      type: 'image',
      attrs: { src: 'https://placehold.co/400x300.png', alt: 'sample', width: 200, height: 150 },
    },
  ],
}

export const VRTImageWithWidth: Story = {
  name: '幅指定画像',
  render: () => (
    <Stack gap={2}>
      <FormControl label="幅指定画像（通常）">
        <RichTextEditor features={['image']} defaultValue={imageWithWidthContent} />
      </FormControl>
      <FormControl label="幅指定画像（読み取り専用）">
        <RichTextEditor features={['image']} readOnly defaultValue={imageWithWidthContent} />
      </FormControl>
    </Stack>
  ),
}

// 読み込みに失敗する画像。壊れていても選択・削除できるよう、非表示にせず枠線と
// 最小サイズで存在を示す（幅・高さ指定なしだと箱が潰れてクリックできないため）。
const brokenImageContent = {
  type: 'doc' as const,
  content: [
    {
      type: 'paragraph',
      content: [{ type: 'text', text: '読み込みに失敗する画像:' }],
    },
    {
      type: 'image',
      attrs: { src: 'https://example.com/does-not-exist.png', alt: '読み込めない画像' },
    },
  ],
}

export const VRTBrokenImage: Story = {
  name: '読み込み失敗画像',
  render: () => (
    <FormControl label="読み込み失敗画像">
      <RichTextEditor features={['image']} defaultValue={brokenImageContent} />
    </FormControl>
  ),
}

export const VRTSizeAndResize: Story = {
  name: 'サイズ指定とリサイズハンドル',
  render: () => (
    <Stack gap={2}>
      <FormControl label="高さ指定なし（最小高さ）">
        <RichTextEditor features={ALL_FEATURES} />
      </FormControl>
      <FormControl label="高さ200px固定">
        <RichTextEditor features={ALL_FEATURES} height={200} defaultValue={richContent} />
      </FormControl>
      <FormControl label="幅400px・高さ150px">
        <RichTextEditor features={ALL_FEATURES} width={400} height={150} />
      </FormControl>
      <FormControl label="リサイズ可・文字数カウントあり">
        <RichTextEditor features={ALL_FEATURES} resizable height={150} showCharacterCount />
      </FormControl>
      <FormControl label="リサイズ可・文字数カウントなし">
        <RichTextEditor features={ALL_FEATURES} resizable height={150} />
      </FormControl>
      <FormControl label="リサイズ可・読み取り専用（ハンドルなし）">
        <RichTextEditor
          features={ALL_FEATURES}
          resizable
          readOnly
          height={150}
          defaultValue={richContent}
        />
      </FormControl>
      <FormControl label="リサイズ可・無効（ハンドルなし）">
        <RichTextEditor features={ALL_FEATURES} resizable disabled height={150} />
      </FormControl>
    </Stack>
  ),
}

export const VRTMobileToolbar: Story = {
  name: 'モバイルツールバー（2段目を閉じた状態）',
  render: () => (
    <EnvironmentProvider environment={{ mobile: true }}>
      <Stack gap={2}>
        <FormControl label="全機能・モバイル幅">
          <RichTextEditor features={ALL_FEATURES} width={375} defaultValue={richContent} />
        </FormControl>
        <FormControl label="無効・モバイル幅">
          <RichTextEditor features={ALL_FEATURES} width={375} disabled defaultValue={richContent} />
        </FormControl>
        <FormControl label="2段目に入る項目が無い（トグルなし）">
          <RichTextEditor features={['bold', 'italic']} width={375} defaultValue={richContent} />
        </FormControl>
      </Stack>
    </EnvironmentProvider>
  ),
}

export const VRTMobileToolbarExpanded: Story = {
  name: 'モバイルツールバー（2段目を開いた状態）',
  render: () => (
    <EnvironmentProvider environment={{ mobile: true }}>
      <FormControl label="全機能・モバイル幅">
        <RichTextEditor features={ALL_FEATURES} width={375} defaultValue={richContent} />
      </FormControl>
    </EnvironmentProvider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const toggle = await canvas.findByRole('button', { name: 'その他の書式' })
    // userEvent.click ではなく click() を使うのは、ポインタ操作に伴う hover 状態が
    // スナップショットに残ると背景色が変わって差分の原因になるため
    toggle.click()
  },
}
