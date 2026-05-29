import { RichTextContent } from '../RichTextContent'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Components/RichTextEditor/RichTextContent',
  component: RichTextContent,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof RichTextContent>

export default meta
type Story = StoryObj<typeof meta>

const sampleJSON = {
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
        { type: 'text', text: 'これは' },
        { type: 'text', marks: [{ type: 'bold' }], text: '太字' },
        { type: 'text', text: 'と' },
        { type: 'text', marks: [{ type: 'italic' }], text: '斜体' },
        { type: 'text', text: 'と' },
        { type: 'text', marks: [{ type: 'underline' }], text: '下線' },
        { type: 'text', text: 'と' },
        { type: 'text', marks: [{ type: 'strike' }], text: '打ち消し線' },
        { type: 'text', text: 'と' },
        { type: 'text', marks: [{ type: 'code' }], text: 'インラインコード' },
        { type: 'text', text: 'を含む段落です。' },
      ],
    },
    {
      type: 'bulletList',
      content: [
        {
          type: 'listItem',
          content: [{ type: 'paragraph', content: [{ type: 'text', text: 'リスト項目1' }] }],
        },
        {
          type: 'listItem',
          content: [{ type: 'paragraph', content: [{ type: 'text', text: 'リスト項目2' }] }],
        },
      ],
    },
    {
      type: 'orderedList',
      content: [
        {
          type: 'listItem',
          content: [{ type: 'paragraph', content: [{ type: 'text', text: '番号付き項目1' }] }],
        },
        {
          type: 'listItem',
          content: [{ type: 'paragraph', content: [{ type: 'text', text: '番号付き項目2' }] }],
        },
      ],
    },
    {
      type: 'blockquote',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: '引用テキストです。' }],
        },
      ],
    },
    {
      type: 'codeBlock',
      content: [{ type: 'text', text: 'const hello = "world"' }],
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
              content: [{ type: 'paragraph', content: [{ type: 'text', text: '項目' }] }],
            },
            {
              type: 'tableHeader',
              content: [{ type: 'paragraph', content: [{ type: 'text', text: '説明' }] }],
            },
          ],
        },
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableCell',
              content: [{ type: 'paragraph', content: [{ type: 'text', text: 'テーブル' }] }],
            },
            {
              type: 'tableCell',
              content: [{ type: 'paragraph', content: [{ type: 'text', text: 'サンプルデータ' }] }],
            },
          ],
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        { type: 'text', text: 'リンクの例: ' },
        {
          type: 'text',
          marks: [
            {
              type: 'link',
              attrs: {
                href: 'https://smarthr.design',
                target: '_blank',
                rel: 'noopener noreferrer nofollow',
                class: null,
                title: null,
              },
            },
          ],
          text: 'SmartHR Design System',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        { type: 'text', text: '文字色の例: ' },
        {
          type: 'text',
          marks: [{ type: 'textStyle', attrs: { color: '#e01e5a' } }],
          text: '赤いテキスト',
        },
        { type: 'text', text: '・' },
        {
          type: 'text',
          marks: [{ type: 'textStyle', attrs: { color: '#0077c7' } }],
          text: '青いテキスト',
        },
        { type: 'text', text: '・' },
        {
          type: 'text',
          marks: [{ type: 'textStyle', attrs: { color: '#0f7f85' } }],
          text: '緑のテキスト',
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
          text: '赤字+黄色背景',
        },
      ],
    },
    {
      type: 'paragraph',
      attrs: { textAlign: 'center' },
      content: [{ type: 'text', text: '中央揃えのテキスト' }],
    },
    {
      type: 'paragraph',
      attrs: { textAlign: 'right' },
      content: [{ type: 'text', text: '右揃えのテキスト' }],
    },
    {
      type: 'heading',
      attrs: { level: 3, textAlign: 'center' },
      content: [{ type: 'text', text: '中央揃えの見出し3' }],
    },
    {
      type: 'image',
      attrs: {
        src: 'https://placehold.co/400x200/e2e8f0/64748b?text=Sample+Image',
        alt: 'サンプル画像',
      },
    },
    {
      type: 'youtube',
      attrs: {
        src: 'https://www.youtube-nocookie.com/embed/ZFwv6s7kXCQ',
        width: 480,
        height: 270,
      },
    },
  ],
}

export const JSONPreview: Story = {
  args: {
    content: sampleJSON,
  },
}

export const HTMLPreview: Story = {
  args: {
    content: {
      format: 'html' as const,
      content: [
        '<h1>HTML見出し1</h1>',
        '<h2>HTML見出し2</h2>',
        '<p>これは<strong>HTML</strong>から表示しています。</p>',
        '<ul><li>項目1</li><li>項目2</li></ul>',
        '<hr>',
        '<p><code>コード</code>と<s>打ち消し線</s></p>',
        '<p><a href="https://smarthr.design" target="_blank" rel="noopener noreferrer">SmartHR Design System</a></p>',
        '<p><span style="color: #e01e5a">赤いテキスト</span>・<span style="color: #0077c7">青いテキスト</span></p>',
        '<p><span style="background-color: #fbf3c4">黄色ハイライト</span>・<span style="background-color: #d2e9f5">水色ハイライト</span>・<span style="color: #e01e5a; background-color: #fbf3c4">赤字+黄色背景</span></p>',
        '<p style="text-align: center">中央揃えのHTML</p>',
        '<p style="text-align: right">右揃えのHTML</p>',
        '<table><tr><th>項目</th><th>説明</th></tr><tr><td>テーブル</td><td>サンプルデータ</td></tr></table>',
        '<img src="https://placehold.co/400x200/e2e8f0/64748b?text=Sample+Image" alt="サンプル画像">',
        '<div data-youtube-video><iframe src="https://www.youtube-nocookie.com/embed/ZFwv6s7kXCQ" width="480" height="270" allowfullscreen></iframe></div>',
      ].join(''),
    },
  },
}
