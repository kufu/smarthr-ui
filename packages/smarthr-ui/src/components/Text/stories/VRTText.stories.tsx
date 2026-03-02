import { pictParser } from '../../../libs/pictParser'
import { Stack } from '../../Layout'
import { STYLE_TYPE_MAP, Text } from '../Text'

import type { Meta, StoryObj } from '@storybook/react-webpack5'
import type { ComponentProps } from 'react'

// $ pict text.pict
const pict = pictParser<ComponentProps<typeof Stack>>(
  `size	weight	color	leading	emphasis	prefixIcon	suffixIcon	maxLines
   undefined	normal	TEXT_LINK	undefined	false	undefined	undefined	1
   XL	bold	undefined	TIGHT	true	undefined	<Icon />	undefined
   XL	undefined	inherit	NORMAL	false	<Icon />	undefined	6
   M	undefined	TEXT_BLACK	LOOSE	false	undefined	<Icon />	3
   S	bold	TEXT_LINK	NONE	true	undefined	<Icon />	4
   XXS	bold	TEXT_GREY	undefined	true	undefined	<Icon />	6
   XL	bold	TEXT_DISABLED	NORMAL	true	undefined	<Icon />	1
   XL	bold	TEXT_WHITE	LOOSE	true	<Icon />	undefined	2
   XXS	normal	TEXT_WHITE	TIGHT	false	<Icon />	undefined	5
   undefined	undefined	TEXT_GREY	NONE	false	<Icon />	undefined	undefined
   S	normal	inherit	NORMAL	false	undefined	<Icon />	5
   M	normal	undefined	undefined	false	<Icon />	undefined	2
   XS	normal	TEXT_DISABLED	NONE	false	undefined	<Icon />	2
   L	bold	TEXT_BLACK	TIGHT	true	<Icon />	undefined	3
   undefined	bold	TEXT_BLACK	NORMAL	false	<Icon />	undefined	4
   XS	bold	TEXT_BLACK	undefined	true	<Icon />	undefined	5
   M	bold	inherit	TIGHT	true	undefined	<Icon />	1
   S	undefined	TEXT_DISABLED	TIGHT	false	<Icon />	undefined	2
   M	normal	TEXT_GREY	LOOSE	false	<Icon />	undefined	4
   undefined	bold	TEXT_WHITE	LOOSE	true	undefined	<Icon />	6
   L	undefined	TEXT_DISABLED	undefined	false	undefined	<Icon />	undefined
   L	undefined	undefined	NORMAL	false	<Icon />	undefined	4
   XXS	undefined	TEXT_LINK	NORMAL	false	<Icon />	undefined	2
   M	bold	TEXT_LINK	NORMAL	true	undefined	<Icon />	undefined
   XS	undefined	inherit	undefined	false	<Icon />	undefined	3
   undefined	normal	undefined	NONE	false	<Icon />	undefined	3
   XL	undefined	TEXT_WHITE	NONE	false	undefined	undefined	3
   XXL	undefined	undefined	LOOSE	false	undefined	<Icon />	1
   S	normal	TEXT_WHITE	undefined	false	undefined	<Icon />	undefined
   undefined	undefined	TEXT_DISABLED	LOOSE	false	<Icon />	undefined	5
   S	normal	undefined	NONE	false	undefined	undefined	6
   XXL	bold	TEXT_DISABLED	TIGHT	true	<Icon />	undefined	4
   XXS	bold	inherit	LOOSE	true	undefined	undefined	undefined
   M	undefined	TEXT_WHITE	NONE	false	undefined	<Icon />	1
   XXL	normal	inherit	NONE	false	<Icon />	undefined	2
   XS	bold	undefined	TIGHT	false	undefined	<Icon />	6
   XXL	normal	TEXT_BLACK	NORMAL	false	undefined	undefined	undefined
   XXL	bold	TEXT_GREY	NORMAL	true	undefined	undefined	3
   XS	bold	TEXT_WHITE	NORMAL	true	undefined	undefined	4
   S	bold	TEXT_LINK	LOOSE	true	undefined	<Icon />	3
   XS	bold	TEXT_LINK	NONE	false	undefined	<Icon />	5
   S	undefined	TEXT_BLACK	NONE	false	<Icon />	undefined	1
   XXS	bold	TEXT_DISABLED	undefined	true	undefined	<Icon />	4
   undefined	normal	inherit	TIGHT	false	<Icon />	undefined	4
   XL	normal	TEXT_GREY	undefined	false	undefined	undefined	5
   XS	bold	TEXT_GREY	LOOSE	false	undefined	<Icon />	undefined
   L	normal	TEXT_LINK	NONE	false	<Icon />	undefined	6
   L	bold	TEXT_GREY	LOOSE	true	<Icon />	undefined	1
   XS	bold	TEXT_LINK	TIGHT	true	undefined	<Icon />	1
   S	bold	TEXT_GREY	TIGHT	true	undefined	<Icon />	2
   XXL	undefined	TEXT_BLACK	undefined	false	undefined	undefined	6
   L	undefined	TEXT_WHITE	LOOSE	false	<Icon />	undefined	2
   XXS	undefined	undefined	NONE	false	undefined	<Icon />	1
   XXL	bold	TEXT_LINK	undefined	true	undefined	undefined	5
   XL	normal	TEXT_LINK	undefined	false	undefined	undefined	4
   XL	undefined	TEXT_BLACK	undefined	false	undefined	undefined	2
   M	normal	TEXT_DISABLED	undefined	false	<Icon />	undefined	6
   L	undefined	inherit	undefined	false	undefined	<Icon />	5
   M	bold	undefined	LOOSE	true	<Icon />	undefined	5
   undefined	undefined	undefined	undefined	false	undefined	<Icon />	2
   XXL	bold	TEXT_WHITE	NONE	true	undefined	<Icon />	4
   XXS	undefined	TEXT_DISABLED	undefined	false	<Icon />	undefined	3
   XXS	bold	TEXT_BLACK	undefined	false	undefined	<Icon />	undefined`,
  ({ prefixIcon, suffixIcon, ...rest }) => {
    const result = rest

    if (prefixIcon || suffixIcon) {
      result.icon = {
        prefix: prefixIcon,
        suffix: suffixIcon,
      }
    }

    return result
  },
)

export default {
  title: 'Components/Text/VRT',
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
