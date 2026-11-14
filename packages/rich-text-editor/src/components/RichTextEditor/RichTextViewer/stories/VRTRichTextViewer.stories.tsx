import { Stack } from 'smarthr-ui'

import { RichTextEditor } from '../../RichTextEditor/RichTextEditor'
import { RichTextViewer } from '../RichTextViewer'

import type { Meta, StoryObj } from '@storybook/react-vite'

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
      content: [
        { type: 'text', text: '背景色の例: ' },
        {
          type: 'text',
          marks: [{ type: 'textStyle', attrs: { backgroundColor: '#f1e8ce' } }],
          text: '黄色ハイライト',
        },
        { type: 'text', text: '・' },
        {
          type: 'text',
          marks: [{ type: 'textStyle', attrs: { backgroundColor: '#cef0f1' } }],
          text: '水色ハイライト',
        },
        { type: 'text', text: '・' },
        {
          type: 'text',
          marks: [{ type: 'textStyle', attrs: { color: '#9e3b4e', backgroundColor: '#f1e8ce' } }],
          text: '赤字+黄色背景',
        },
      ],
    },
  ],
}

const meta = {
  title: 'Editor/RichTextViewer/VRT',
  component: RichTextViewer,
  tags: ['!autodocs'],
  parameters: {
    chromatic: { disableSnapshot: false },
    layout: 'padded',
  },
} satisfies Meta<typeof RichTextViewer>

export default meta
type Story = StoryObj<typeof meta>

export const AllElements: Story = {
  args: {
    content: richContent,
  },
  render: (args) => (
    <Stack gap={2}>
      <RichTextViewer {...args} />
      <RichTextViewer
        content={{ format: 'html', content: '<p><strong>HTML</strong>から表示</p>' }}
      />
      <RichTextViewer content={{ format: 'empty' }} />
    </Stack>
  ),
}

export const BackgroundColor: Story = {
  name: '背景色ハイライト',
  args: {
    content: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: '背景色の例 (JSON): ' },
            {
              type: 'text',
              marks: [{ type: 'textStyle', attrs: { backgroundColor: '#f1e8ce' } }],
              text: '黄色ハイライト',
            },
            { type: 'text', text: '・' },
            {
              type: 'text',
              marks: [{ type: 'textStyle', attrs: { backgroundColor: '#cef0f1' } }],
              text: '水色ハイライト',
            },
            { type: 'text', text: '・' },
            {
              type: 'text',
              marks: [
                {
                  type: 'textStyle',
                  attrs: { color: '#9e3b4e', backgroundColor: '#f1e8ce' },
                },
              ],
              text: '赤字+黄色背景',
            },
          ],
        },
      ],
    },
  },
  render: ({ content }) => (
    <Stack gap={2}>
      <RichTextViewer content={content} />
      <RichTextViewer
        content={{
          format: 'html',
          content:
            '<p>背景色の例 (HTML): <span style="background-color: #f1e8ce">黄色ハイライト</span>・<span style="background-color: #cef0f1">水色ハイライト</span>・<span style="color: #9e3b4e; background-color: #f1e8ce">赤字+黄色背景</span></p>',
        }}
      />
    </Stack>
  ),
}

export const Gap: Story = {
  name: 'gap バリエーション',
  args: {
    content: {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: '見出し' }],
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: '1段落目のテキストです。' }],
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: '2段落目のテキストです。' }],
        },
        {
          type: 'bulletList',
          content: [
            {
              type: 'listItem',
              content: [{ type: 'paragraph', content: [{ type: 'text', text: '項目1' }] }],
            },
            {
              type: 'listItem',
              content: [{ type: 'paragraph', content: [{ type: 'text', text: '項目2' }] }],
            },
          ],
        },
      ],
    },
  },
  render: ({ content }) => (
    <Stack gap={2}>
      <RichTextViewer content={content} gap={0.5} />
      <RichTextViewer content={content} gap={1} />
      <RichTextViewer content={content} gap={2} />
    </Stack>
  ),
}

const paragraph = (text: string) => ({ type: 'paragraph', content: [{ type: 'text', text }] })
const listItem = (content: Array<Record<string, unknown>>) => ({ type: 'listItem', content })

export const SameAsEditor: Story = {
  name: 'エディタと同じ表示（左: エディタ、右: 表示）',
  args: {
    content: {
      type: 'doc',
      content: [
        paragraph('段落1'),
        paragraph('段落2'),
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '見出し' }] },
        paragraph('段落3'),
        {
          type: 'bulletList',
          content: [
            listItem([
              paragraph('項目1'),
              { type: 'bulletList', content: [listItem([paragraph('入れ子の項目')])] },
            ]),
            listItem([paragraph('項目2')]),
          ],
        },
        paragraph('段落4'),
        paragraph('    行頭の空白と    連続した空白'),
        { type: 'blockquote', content: [paragraph('引用')] },
        { type: 'codeBlock', content: [{ type: 'text', text: 'const x = 1' }] },
        {
          type: 'codeBlock',
          content: [
            {
              type: 'text',
              text: `const message = ${Array(12).fill("'長い行は折り返す'").join(' + ')}`,
            },
          ],
        },
        { type: 'horizontalRule' },
        { type: 'image', attrs: { src: '/fixtures/sample-png.png', alt: '画像', width: 120 } },
        {
          type: 'youtube',
          attrs: { src: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', width: 160, height: 90 },
        },
        {
          type: 'table',
          content: [
            {
              type: 'tableRow',
              content: [
                { type: 'tableHeader', content: [paragraph('見出しセル')] },
                { type: 'tableHeader', content: [paragraph('見出しセル')] },
              ],
            },
            {
              type: 'tableRow',
              content: [
                { type: 'tableCell', content: [paragraph('セル')] },
                { type: 'tableCell', content: [paragraph('セル')] },
              ],
            },
          ],
        },
        paragraph('段落5'),
      ],
    },
  },
  render: ({ content }) => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
      <RichTextEditor defaultValue={content} hideToolbar />
      <RichTextViewer content={content} />
    </div>
  ),
  parameters: {
    chromatic: { ignoreSelectors: ['iframe'] },
  },
}

export const Table: Story = {
  name: '表（結合セル・列幅・セル内寄せ）',
  args: {
    content: {
      type: 'doc',
      content: [
        {
          type: 'table',
          content: [
            {
              type: 'tableRow',
              content: [
                {
                  type: 'tableHeader',
                  attrs: { colspan: 2, colwidth: [120, 180] },
                  content: [{ type: 'paragraph', content: [{ type: 'text', text: '結合ヘッダ' }] }],
                },
                {
                  type: 'tableHeader',
                  attrs: { align: 'right', colwidth: [90] },
                  content: [{ type: 'paragraph', content: [{ type: 'text', text: '右寄せ' }] }],
                },
              ],
            },
            {
              type: 'tableRow',
              content: [
                {
                  type: 'tableCell',
                  attrs: { rowspan: 2 },
                  content: [{ type: 'paragraph', content: [{ type: 'text', text: '2行結合' }] }],
                },
                {
                  type: 'tableCell',
                  attrs: { align: 'center' },
                  content: [{ type: 'paragraph', content: [{ type: 'text', text: '中央' }] }],
                },
                {
                  type: 'tableCell',
                  content: [{ type: 'paragraph', content: [{ type: 'text', text: '通常' }] }],
                },
              ],
            },
            {
              type: 'tableRow',
              content: [
                {
                  type: 'tableCell',
                  content: [{ type: 'paragraph', content: [{ type: 'text', text: 'A' }] }],
                },
                {
                  type: 'tableCell',
                  content: [{ type: 'paragraph', content: [{ type: 'text', text: 'B' }] }],
                },
              ],
            },
          ],
        },
      ],
    },
  },
  render: ({ content }) => (
    <Stack gap={2}>
      <RichTextViewer content={content} />
      <RichTextViewer
        content={{
          format: 'html',
          content:
            '<table><tbody><tr><th colspan="2">結合ヘッダ (HTML)</th><th>ヘッダ</th></tr><tr><td rowspan="2">2行結合</td><td>セル</td><td>セル</td></tr><tr><td>A</td><td>B</td></tr></tbody></table>',
        }}
      />
    </Stack>
  ),
}

const LONG_TEXT =
  '両端揃えは行の端まで文字間を広げるため、折り返しが起きる長さの文章でないと左揃えと見分けがつきません。'

export const TextAlign: Story = {
  name: '文字揃え',
  args: {
    content: {
      type: 'doc',
      content: [
        ...['left', 'center', 'right', 'justify'].map((textAlign) => ({
          type: 'paragraph',
          attrs: { textAlign },
          content: [{ type: 'text', text: `${textAlign}: ${LONG_TEXT}` }],
        })),
        {
          type: 'heading',
          attrs: { level: 2, textAlign: 'center' },
          content: [{ type: 'text', text: '中央揃えの見出し' }],
        },
      ],
    },
  },
  render: ({ content }) => (
    <div style={{ width: 360 }}>
      <RichTextViewer content={content} />
    </div>
  ),
}

export const Media: Story = {
  name: 'コードブロック・画像・YouTube',
  args: {
    content: {
      type: 'doc',
      content: [
        {
          type: 'codeBlock',
          attrs: { language: 'typescript' },
          content: [
            { type: 'text', text: 'const greeting: string = "hello"\nconsole.log(greeting)' },
          ],
        },
        {
          type: 'image',
          attrs: { src: '/fixtures/sample-png.png', alt: '幅200pxの画像', width: 200 },
        },
        {
          type: 'youtube',
          attrs: { src: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', width: 320, height: 180 },
        },
      ],
    },
  },
  parameters: {
    // 埋め込み先の描画は YouTube 側の都合で変わるため、中身は比較せず枠の大きさだけを見る
    chromatic: { ignoreSelectors: ['iframe'] },
  },
}

export const MediaAlign: Story = {
  name: '画像・YouTube の配置（左・中央・右）',
  args: {
    content: {
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
          attrs: {
            src: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            width: 320,
            height: 180,
            align,
          },
        },
      ]),
    },
  },
  parameters: {
    chromatic: { ignoreSelectors: ['iframe'] },
  },
}

export const YoutubeSize: Story = {
  name: 'YouTube のサイズ（表示幅より広い動画は縦横比を保って縮む）',
  args: {
    content: {
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
    },
  },
  render: ({ content }) => (
    <div style={{ width: 400 }}>
      <RichTextViewer content={content} />
    </div>
  ),
  parameters: {
    chromatic: { ignoreSelectors: ['iframe'] },
  },
}

const VIDEO_SRC = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'

export const Video: Story = {
  name: '動画（配置・表示幅より広い動画・不正な src）',
  args: {
    content: {
      type: 'doc' as const,
      content: [
        ...[null, 'center', 'right'].map((align) => ({
          type: 'video',
          attrs: {
            src: VIDEO_SRC,
            poster: '/fixtures/sample-jpeg.jpg',
            title: `配置 ${align ?? 'left'} の動画`,
            width: 240,
            height: 135,
            align,
          },
        })),
        {
          type: 'video',
          attrs: { src: VIDEO_SRC, poster: '/fixtures/sample-jpeg.jpg', width: 960, height: 540 },
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'この下の動画は src が不正なため描画されない' }],
        },
        { type: 'video', attrs: { src: '//example.com/a.mp4' } },
      ],
    },
  },
  render: ({ content }) => (
    <div style={{ width: 400 }}>
      <RichTextViewer content={content} />
    </div>
  ),
  parameters: {
    // 再生前の描画はブラウザの都合で変わるため、中身は比較せず枠の大きさだけを見る
    chromatic: { ignoreSelectors: ['video'] },
  },
}
