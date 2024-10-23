import { within } from '@storybook/test'
import React, { ComponentProps } from 'react'

import { FaCircleQuestionIcon, FaUpRightFromSquareIcon } from '../../Icon'
import { Stack } from '../../Layout'
import { TextLink } from '../TextLink'

import type { Meta, StoryObj } from '@storybook/react'

/**
 * $ pict text-link.pict
 * href    prefix  suffix  targetBlank
 * あり    なし    なし    あり
 * あり    なし    あり    なし
 * なし    あり    なし    なし
 * あり    あり    なし    なし
 * なし    なし    なし    あり
 * なし    なし    あり    なし
 */
const _cases: Array<
  Pick<ComponentProps<typeof TextLink>, 'href' | 'prefix' | 'suffix' | 'target'>
> = [
  { href: '#', prefix: undefined, suffix: undefined, target: '_blank' },
  { href: '#', prefix: undefined, suffix: <FaUpRightFromSquareIcon />, target: undefined },
  { href: undefined, prefix: <FaCircleQuestionIcon />, suffix: undefined, target: undefined },
  { href: '#', prefix: <FaCircleQuestionIcon />, suffix: undefined, target: undefined },
  { href: undefined, prefix: undefined, suffix: undefined, target: '_blank' },
  { href: undefined, prefix: undefined, suffix: <FaUpRightFromSquareIcon />, target: undefined },
]

export default {
  title: 'Navigation（ナビゲーション）/TextLink/VRT',
  render: (args) => (
    <Stack>
      {_cases.map((props, i) => (
        <p key={i}>
          <TextLink {...args} {...props} />
        </p>
      ))}
    </Stack>
  ),
  args: {
    children:
      '健康保険厚生年金保険被保険者生年月日訂正届船員保険厚生年金保険被保険者生年月日訂正届船員保険厚生年金保険被保険者資格記録訂正届船員保険厚生年金保険被保険者資格記録取消届船員保険被保険者離職事由訂正届基礎年金番号氏名生年月日性別変更（訂正）届',
  },
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
} satisfies Meta<typeof TextLink>

export const VRT: StoryObj<typeof TextLink> = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const { length, [length - 1]: last } = canvas.getAllByRole('link')
    last.focus()
  },
}

export const VRTForcedColors: StoryObj = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
