import { FormControl } from '../../../FormControl'
import { Stack } from '../../../Layout'
import { FlexibleRichTextEditor } from '../FlexibleRichTextEditor'

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
  title: 'Components/RichTextEditor/FlexibleRichTextEditor/VRT',
  component: FlexibleRichTextEditor,
  tags: ['!autodocs'],
  parameters: {
    chromatic: { disableSnapshot: false },
    layout: 'padded',
  },
} satisfies Meta<typeof FlexibleRichTextEditor>

export default meta
type Story = StoryObj<typeof meta>

export const AllStates: Story = {
  render: () => (
    <Stack gap={2}>
      <FormControl label="HTML入力">
        <FlexibleRichTextEditor
          features={ALL_FEATURES}
          content={{
            format: 'html',
            content:
              '<p>既存の<strong>HTML</strong>コンテンツ。<em>斜体</em>と<u>下線</u>も含む。</p>',
          }}
        />
      </FormControl>
      <FormControl label="JSON入力">
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
        />
      </FormControl>
      <FormControl label="空コンテンツ">
        <FlexibleRichTextEditor
          features={ALL_FEATURES}
          content={{ format: 'empty' }}
          placeholder="何か入力してください"
        />
      </FormControl>
    </Stack>
  ),
}
