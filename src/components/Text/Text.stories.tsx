import React from 'react'
import { Story } from '@storybook/react'

// import { useTheme } from '../../hooks/useTheme'

import { Text } from './Text'

import readme from './README.md'

export default {
  title: 'Text',
  component: Text,
  parameters: {
    docs: {
      description: { component: readme },
    },
  },
}

export const Default: Story = () => (
  <>
    <Text>
      デフォルトの出力要素は <code>span</code> で、文字サイズは <code>M</code>、行間は{' '}
      <code>NORMAL</code>、色は <code>inherit</code> です。
    </Text>
    <Text as="p">
      styled-components と同じく <code>as</code> で要素を差し替えられます。
    </Text>
    <Text as="p">
      <Text color="TEXT_GREY">色</Text>や<Text weight="bold">ウェイト</Text>を変えられます。
    </Text>
    <Text as="p">
      <code>emphasis</code> を渡すとそのテキストは<Text emphasis>強調</Text>を示し、<code>em</code>{' '}
      要素の太字装飾で出力します。
    </Text>
    <Text as="p">
      <Text emphasis>入れ子</Text>もできますが、
      <Text color="TEXT_LINK" weight="bold">
        Valid
      </Text>{' '}
      な HTML になるよう注意してください。
    </Text>
  </>
)
