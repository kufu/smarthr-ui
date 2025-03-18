import type { Meta, StoryObj } from '@storybook/react'

import { VisuallyHiddenText } from '../VisuallyHiddenText'
import { Stack } from '../../Layout'
const asOptions = { なし: undefined, '<p>': 'p', '<div>': 'div', '<span>': 'span' }

export default {
  title: 'Text（テキスト）/VisuallyHiddenText',
  component: VisuallyHiddenText,
  render: (args) => <VisuallyHiddenText {...args} />,
  argTypes: {
    as: {
      control: 'radio',
      options: Object.keys(asOptions),
      mapping: asOptions,
    },
  },
  args: {
    children: 'スクリーンリーダーのみが読み上げるテキストです',
    as: 'なし',
  },
} as Meta<typeof VisuallyHiddenText>

export const VisuallyHiddenTextControl: StoryObj<typeof VisuallyHiddenText> = {
  name: 'Playground',
}

export const As: StoryObj<typeof VisuallyHiddenText> = {
  name: 'as',
  render: (args) => (
    <Stack>
      <VisuallyHiddenText {...args}>デフォルト（span）要素</VisuallyHiddenText>
      <VisuallyHiddenText {...args} as="p">
        p要素
      </VisuallyHiddenText>
      <VisuallyHiddenText {...args} as="div">
        div要素
      </VisuallyHiddenText>
      <VisuallyHiddenText {...args} as="h1">
        h1要素
      </VisuallyHiddenText>
    </Stack>
  ),
}
