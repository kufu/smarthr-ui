import { FormControl, Stack } from 'smarthr-ui'
import { within } from 'storybook/test'

import { RichTextEditor } from '../RichTextEditor'

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { TiptapEditorHTMLElement } from '@tiptap/core'

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
      content: [{ type: 'text', text: 'const x = 1\nconsole.log(x)' }],
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
  title: 'Editor/RichTextEditor/VRT',
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
        <RichTextEditor defaultValue={richContent} features={ALL_FEATURES} />
      </FormControl>
      <FormControl label="読み取り専用">
        <RichTextEditor readOnly defaultValue={richContent} features={ALL_FEATURES} />
      </FormControl>
      <FormControl label="無効">
        <RichTextEditor disabled defaultValue={richContent} features={ALL_FEATURES} />
      </FormControl>
      <FormControl errorMessages="入力内容にエラーがあります" label="エラー">
        <RichTextEditor defaultValue={richContent} features={ALL_FEATURES} error />
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
          defaultValue={backgroundColorContent}
          features={['color', 'backgroundColor']}
        />
      </FormControl>
      <FormControl label="背景色付きコンテンツ（読み取り専用）">
        <RichTextEditor
          readOnly
          defaultValue={backgroundColorContent}
          features={['color', 'backgroundColor']}
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
        <RichTextEditor defaultValue={imageWithWidthContent} features={['image']} />
      </FormControl>
      <FormControl label="幅指定画像（読み取り専用）">
        <RichTextEditor readOnly defaultValue={imageWithWidthContent} features={['image']} />
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
      <RichTextEditor defaultValue={brokenImageContent} features={['image']} />
    </FormControl>
  ),
}

const mediaAlignContent = {
  type: 'doc' as const,
  content: [null, 'center', 'right'].flatMap((align) => [
    {
      type: 'image',
      attrs: {
        src: '/fixtures/sample-png.png',
        alt: `配置 ${align ?? 'left'} の画像`,
        width: 200,
        align,
      },
    },
    {
      type: 'youtube',
      attrs: { src: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', width: 320, height: 180, align },
    },
  ]),
}

export const VRTMediaAlign: Story = {
  name: '画像・YouTube の配置（左・中央・右）',
  render: () => (
    <FormControl label="画像・YouTube の配置">
      <RichTextEditor defaultValue={mediaAlignContent} features={['image', 'youtube']} />
    </FormControl>
  ),
  parameters: {
    chromatic: { ignoreSelectors: ['iframe'] },
  },
}

const youtubeSizeContent = {
  type: 'doc' as const,
  content: [
    {
      type: 'youtube',
      attrs: { src: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', width: 480, height: 270 },
    },
    // 16:9 にする前の既定サイズで保存された動画
    {
      type: 'youtube',
      attrs: { src: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', width: 640, height: 480 },
    },
  ],
}

export const VRTYoutubeSize: Story = {
  name: 'YouTube のサイズ（エディタより広い動画は縦横比を保って縮む）',
  render: () => (
    <FormControl label="YouTube のサイズ">
      <RichTextEditor defaultValue={youtubeSizeContent} features={['youtube']} width={400} />
    </FormControl>
  ),
  parameters: {
    chromatic: { ignoreSelectors: ['iframe'] },
  },
}

export const VRTSizeAndResize: Story = {
  name: 'サイズ指定とリサイズハンドル',
  render: () => (
    <Stack gap={2}>
      <FormControl label="高さ指定なし（最小高さ）">
        <RichTextEditor features={ALL_FEATURES} />
      </FormControl>
      <FormControl label="高さ200px固定">
        <RichTextEditor defaultValue={richContent} features={ALL_FEATURES} height={200} />
      </FormControl>
      <FormControl label="幅400px・高さ150px">
        <RichTextEditor features={ALL_FEATURES} width={400} height={150} />
      </FormControl>
      <FormControl label="リサイズ可・文字数カウントあり">
        <RichTextEditor features={ALL_FEATURES} resizable showCharacterCount height={150} />
      </FormControl>
      <FormControl label="リサイズ可・文字数カウントなし">
        <RichTextEditor features={ALL_FEATURES} resizable height={150} />
      </FormControl>
      <FormControl label="リサイズ可・読み取り専用（ハンドルなし）">
        <RichTextEditor
          readOnly
          defaultValue={richContent}
          features={ALL_FEATURES}
          resizable
          height={150}
        />
      </FormControl>
      <FormControl label="リサイズ可・無効（ハンドルなし）">
        <RichTextEditor disabled features={ALL_FEATURES} resizable height={150} />
      </FormControl>
    </Stack>
  ),
}

export const VRTScrollableToolbar: Story = {
  name: 'ツールバーの横スクロール（既定の表示）',
  render: () => (
    <Stack gap={2}>
      <FormControl label="幅375px">
        <RichTextEditor defaultValue={richContent} features={ALL_FEATURES} width={375} />
      </FormControl>
      <FormControl label="幅480px">
        <RichTextEditor defaultValue={richContent} features={ALL_FEATURES} width={480} />
      </FormControl>
      <FormControl label="幅600px">
        <RichTextEditor defaultValue={richContent} features={ALL_FEATURES} width={600} />
      </FormControl>
      <FormControl label="無効・幅375px">
        <RichTextEditor disabled defaultValue={richContent} features={ALL_FEATURES} width={375} />
      </FormControl>
      <FormControl label="溢れないため折り返しトグルが出ない">
        <RichTextEditor defaultValue={richContent} features={['bold', 'italic']} width={375} />
      </FormControl>
    </Stack>
  ),
}

/**
 * userEvent.click ではなく click() を使うのは、ポインタ操作に伴う hover 状態やツールチップが
 * スナップショットに残ると差分の原因になるため。開いた中身は rAF でフォーカスを移すので、その発火まで待つ
 */
const clickButton = async (canvasElement: HTMLElement, name: string | RegExp) => {
  const button = await within(canvasElement).findByRole('button', { name })

  button.click()
  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
}

export const VRTWrappedToolbar: Story = {
  name: 'ツールバーの折り返し表示（トグルを押した状態）',
  render: () => (
    <FormControl label="全機能・幅375px">
      <RichTextEditor defaultValue={richContent} features={ALL_FEATURES} width={375} />
    </FormControl>
  ),
  play: ({ canvasElement }) => clickButton(canvasElement, '折り返して表示'),
}

export const VRTPlaceholderAndHiddenToolbar: Story = {
  name: 'プレースホルダーとツールバー非表示',
  render: () => (
    <Stack gap={2}>
      <FormControl label="空でプレースホルダーあり">
        <RichTextEditor features={ALL_FEATURES} placeholder="本文を入力してください" />
      </FormControl>
      <FormControl label="ツールバー非表示">
        <RichTextEditor defaultValue={richContent} features={ALL_FEATURES} hideToolbar />
      </FormControl>
    </Stack>
  ),
}

const openToolbarPopup =
  (name: RegExp): Story['play'] =>
  ({ canvasElement }) =>
    clickButton(canvasElement, name)

export const VRTHeadingDropdownOpen: Story = {
  name: '書式のドロップダウン（見出しレベルを制限）',
  render: () => (
    <FormControl label="見出し2・3のみ許可">
      <RichTextEditor defaultValue={richContent} features={ALL_FEATURES} headingLevels={[2, 3]} />
    </FormControl>
  ),
  play: openToolbarPopup(/^書式/),
}

export const VRTLinkPopoverOpen: Story = {
  name: 'リンクのポップオーバー',
  render: () => (
    <FormControl label="リンク">
      <RichTextEditor defaultValue={richContent} features={ALL_FEATURES} />
    </FormControl>
  ),
  play: openToolbarPopup(/^リンク/),
}

export const VRTColorPickerOpen: Story = {
  name: '文字色のパレット',
  render: () => (
    <FormControl label="文字色">
      <RichTextEditor defaultValue={richContent} features={ALL_FEATURES} />
    </FormControl>
  ),
  play: openToolbarPopup(/^文字色/),
}

const createTable = (rows: string[][]) => ({
  type: 'table',
  content: rows.map((cells, row) => ({
    type: 'tableRow',
    content: cells.map((text) => ({
      type: row === 0 ? 'tableHeader' : 'tableCell',
      attrs: { colwidth: [160] },
      content: [{ type: 'paragraph', content: [{ type: 'text', text }] }],
    })),
  })),
})

// 表を2つ続けて置き、上の表の行追加バーと下の表の操作ハンドルが重ならない間隔も写す
const tableContent = {
  type: 'doc' as const,
  content: [
    createTable([
      ['名前', '部署'],
      ['山田 花子', '開発部'],
      ['佐藤 太郎', 'プロダクト部'],
    ]),
    createTable([
      ['拠点', '人数'],
      ['東京', '120'],
    ]),
  ],
}

// DOM の選択範囲を動かすと ProseMirror が取り込むのは次のタスクになり、撮影と競合する。
// focus コマンドはフォーカスを次のフレームへ遅らせ、後から開いたメニューを閉じてしまう
const placeCaretInCell: Story['play'] = async ({ canvasElement }) => {
  const editorElement: TiptapEditorHTMLElement = await within(canvasElement).findByRole('textbox')
  const cell = await within(editorElement).findByText('山田 花子')
  const editor = editorElement.editor

  // 撮りたい状態を作れないまま撮影を通すと、退行を見逃す
  if (!editor) throw new Error('RichTextEditor の editor を取得できません')

  editor.commands.setTextSelection(editor.view.posAtDOM(cell, 0))
  editor.view.focus()

  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
}

export const VRTTableControls: Story = {
  name: '表の操作ハンドル',
  render: () => (
    <FormControl label="セルにキャレットがある状態">
      <RichTextEditor defaultValue={tableContent} features={ALL_FEATURES} />
    </FormControl>
  ),
  play: placeCaretInCell,
}

export const VRTTableContextMenu: Story = {
  name: '表の操作メニュー',
  render: () => (
    <FormControl label="セルの操作メニューを開いた状態">
      <RichTextEditor defaultValue={tableContent} features={ALL_FEATURES} />
    </FormControl>
  ),
  play: async (context) => {
    await placeCaretInCell(context)
    await clickButton(context.canvasElement, 'セルの操作')
  },
}
