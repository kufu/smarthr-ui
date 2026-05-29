import { Stack } from '../../../Layout'
import { RichTextContent } from '../RichTextContent'

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
  ],
}

const meta = {
  title: 'Components/RichTextEditor/RichTextContent/VRT',
  component: RichTextContent,
  tags: ['!autodocs'],
  parameters: {
    chromatic: { disableSnapshot: false },
    layout: 'padded',
  },
} satisfies Meta<typeof RichTextContent>

export default meta
type Story = StoryObj<typeof meta>

export const AllElements: Story = {
  args: {
    content: richContent,
  },
  render: (args) => (
    <Stack gap={2}>
      <RichTextContent {...args} />
      <RichTextContent
        content={{ format: 'html', content: '<p><strong>HTML</strong>から表示</p>' }}
      />
      <RichTextContent content={{ format: 'empty' }} />
    </Stack>
  ),
}

export const BackgroundColor: Story = {
  name: '背景色ハイライト',
  render: () => (
    <Stack gap={2}>
      <RichTextContent
        content={{
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                { type: 'text', text: '背景色の例 (JSON): ' },
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
                  marks: [
                    {
                      type: 'textStyle',
                      attrs: { color: '#e01e5a', backgroundColor: '#fbf3c4' },
                    },
                  ],
                  text: '赤字+黄色背景',
                },
              ],
            },
          ],
        }}
      />
      <RichTextContent
        content={{
          format: 'html',
          content:
            '<p>背景色の例 (HTML): <span style="background-color: #fbf3c4">黄色ハイライト</span>・<span style="background-color: #d2e9f5">水色ハイライト</span>・<span style="color: #e01e5a; background-color: #fbf3c4">赤字+黄色背景</span></p>',
        }}
      />
    </Stack>
  ),
}
