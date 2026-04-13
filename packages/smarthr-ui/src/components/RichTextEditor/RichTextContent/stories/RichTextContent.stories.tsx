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
      content:
        '<h1>HTML見出し1</h1><h2>HTML見出し2</h2><p>これは<strong>HTML</strong>から表示しています。</p><ul><li>項目1</li><li>項目2</li></ul><hr><p><code>コード</code>と<s>打ち消し線</s></p>',
    },
  },
}
