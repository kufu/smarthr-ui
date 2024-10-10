import React from 'react'

import { Stack } from '../../Layout'
import { STYLE_TYPE_MAP, Text } from '../Text'

import type { Meta, StoryObj } from '@storybook/react'

// $ pict text.pict
const pict = [
  { size: 'XS', weight: undefined, color: 'TEXT_LINK', leading: 'NORMAL', emphasis: false },
  { size: 'XL', weight: 'bold', color: 'TEXT_WHITE', leading: 'LOOSE', emphasis: true },
  { size: 'XL', weight: 'normal', color: 'TEXT_BLACK', leading: 'TIGHT', emphasis: false },
  { size: 'XXS', weight: 'bold', color: 'TEXT_LINK', leading: undefined, emphasis: true },
  { size: 'XXL', weight: 'bold', color: 'TEXT_GREY', leading: 'NONE', emphasis: false },
  { size: 'XL', weight: 'bold', color: undefined, leading: 'NORMAL', emphasis: true },
  { size: 'XXL', weight: 'bold', color: 'TEXT_BLACK', leading: undefined, emphasis: true },
  { size: 'XXL', weight: 'bold', color: 'TEXT_LINK', leading: 'TIGHT', emphasis: true },
  { size: 'L', weight: 'bold', color: 'TEXT_GREY', leading: 'LOOSE', emphasis: true },
  { size: 'XXS', weight: 'normal', color: 'TEXT_GREY', leading: undefined, emphasis: false },
  { size: 'XXL', weight: 'bold', color: 'TEXT_DISABLED', leading: 'LOOSE', emphasis: true },
  { size: 'XL', weight: undefined, color: 'TEXT_DISABLED', leading: 'NONE', emphasis: false },
  { size: 'L', weight: undefined, color: 'TEXT_BLACK', leading: 'LOOSE', emphasis: false },
  { size: 'XS', weight: 'bold', color: undefined, leading: 'NONE', emphasis: true },
  { size: 'XS', weight: 'normal', color: 'TEXT_BLACK', leading: 'TIGHT', emphasis: false },
  { size: 'S', weight: 'bold', color: 'TEXT_DISABLED', leading: 'TIGHT', emphasis: true },
  { size: 'XS', weight: 'bold', color: 'inherit', leading: undefined, emphasis: true },
  { size: 'L', weight: 'normal', color: 'TEXT_DISABLED', leading: undefined, emphasis: false },
  { size: undefined, weight: 'bold', color: 'TEXT_BLACK', leading: 'NORMAL', emphasis: true },
  { size: 'XXS', weight: 'normal', color: undefined, leading: 'LOOSE', emphasis: false },
  { size: 'M', weight: 'normal', color: 'TEXT_DISABLED', leading: 'NORMAL', emphasis: false },
  { size: 'L', weight: undefined, color: undefined, leading: 'TIGHT', emphasis: false },
  { size: 'XS', weight: undefined, color: 'TEXT_WHITE', leading: undefined, emphasis: false },
  { size: 'S', weight: 'normal', color: 'TEXT_LINK', leading: 'NONE', emphasis: false },
  { size: 'M', weight: 'bold', color: undefined, leading: undefined, emphasis: true },
  { size: 'S', weight: undefined, color: undefined, leading: 'NORMAL', emphasis: false },
  { size: undefined, weight: undefined, color: 'TEXT_GREY', leading: 'TIGHT', emphasis: false },
  { size: 'L', weight: 'bold', color: 'TEXT_LINK', leading: 'NORMAL', emphasis: false },
  { size: 'S', weight: 'normal', color: 'inherit', leading: 'LOOSE', emphasis: false },
  { size: 'M', weight: 'bold', color: 'inherit', leading: 'NONE', emphasis: true },
  { size: 'XXL', weight: undefined, color: 'inherit', leading: 'NORMAL', emphasis: false },
  { size: 'XL', weight: undefined, color: 'TEXT_GREY', leading: 'NORMAL', emphasis: false },
  { size: 'S', weight: 'normal', color: 'TEXT_WHITE', leading: 'NONE', emphasis: false },
  { size: 'XS', weight: 'bold', color: 'TEXT_GREY', leading: 'LOOSE', emphasis: true },
  { size: 'S', weight: undefined, color: 'TEXT_GREY', leading: undefined, emphasis: false },
  { size: 'XXS', weight: undefined, color: 'TEXT_BLACK', leading: 'NONE', emphasis: false },
  { size: 'XXS', weight: 'bold', color: 'TEXT_WHITE', leading: 'TIGHT', emphasis: true },
  { size: 'XL', weight: undefined, color: 'TEXT_LINK', leading: 'LOOSE', emphasis: false },
  { size: 'S', weight: 'bold', color: 'TEXT_BLACK', leading: 'TIGHT', emphasis: false },
  { size: undefined, weight: 'normal', color: undefined, leading: undefined, emphasis: false },
  { size: 'M', weight: undefined, color: 'TEXT_GREY', leading: 'LOOSE', emphasis: false },
  { size: 'M', weight: 'bold', color: 'TEXT_BLACK', leading: 'TIGHT', emphasis: false },
  { size: 'XXL', weight: 'normal', color: 'TEXT_WHITE', leading: 'NORMAL', emphasis: false },
  { size: 'M', weight: 'bold', color: 'TEXT_LINK', leading: undefined, emphasis: false },
  { size: 'XL', weight: undefined, color: 'inherit', leading: 'TIGHT', emphasis: false },
  { size: 'M', weight: undefined, color: 'TEXT_WHITE', leading: undefined, emphasis: false },
  { size: undefined, weight: 'normal', color: 'TEXT_LINK', leading: 'LOOSE', emphasis: false },
  { size: 'L', weight: undefined, color: 'TEXT_WHITE', leading: 'NONE', emphasis: false },
  { size: 'XXS', weight: 'bold', color: 'TEXT_DISABLED', leading: 'NORMAL', emphasis: true },
  { size: 'L', weight: undefined, color: 'inherit', leading: undefined, emphasis: false },
  { size: undefined, weight: undefined, color: 'TEXT_DISABLED', leading: 'NONE', emphasis: false },
  { size: undefined, weight: undefined, color: 'inherit', leading: 'LOOSE', emphasis: false },
  { size: 'XXL', weight: undefined, color: undefined, leading: undefined, emphasis: false },
  { size: 'XXS', weight: undefined, color: 'inherit', leading: 'LOOSE', emphasis: false },
  { size: undefined, weight: undefined, color: 'TEXT_WHITE', leading: undefined, emphasis: false },
  { size: 'XS', weight: undefined, color: 'TEXT_DISABLED', leading: 'NONE', emphasis: false },
  { size: 'XL', weight: 'bold', color: undefined, leading: undefined, emphasis: false },
]

export default {
  title: 'Text（テキスト）/Text/VRT',
  render: (args) => (
    <Stack gap={0.5}>
      {/* styleType ごとにペアワイズ法で抽出したパターンをあてる */}
      {[undefined, ...Object.keys(STYLE_TYPE_MAP)].map((styleType) =>
        pict.map((props, i) => (
          <Text
            {...props}
            {...args}
            styleType={styleType}
            // 白文字だと見えないので背景色を変える
            className={props.color === 'TEXT_WHITE' ? 'shr-bg-black' : undefined}
            key={i}
          />
        )),
      )}
    </Stack>
  ),
  args: {
    children: 'well-working 労働にまつわる社会課題をなくし、誰もがその人らしく働ける社会をつくる。',
  },
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
} satisfies Meta<typeof Text>

export const VRT = {}

export const VRTForcedColors: StoryObj = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
