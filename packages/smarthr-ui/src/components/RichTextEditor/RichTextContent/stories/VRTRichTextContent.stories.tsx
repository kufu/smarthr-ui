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
