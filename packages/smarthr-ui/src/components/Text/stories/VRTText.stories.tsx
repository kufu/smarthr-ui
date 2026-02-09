import { FaAddressBookIcon } from '../../Icon'
import { Stack } from '../../Layout'
import { STYLE_TYPE_MAP, Text } from '../Text'

import type { Meta, StoryObj } from '@storybook/react-webpack5'
import type { ComponentProps } from 'react'

// $ pict text.pict
const pict = `undefined	normal	TEXT_LINK	undefined	false	undefined	undefined	1
XL	bold	undefined	TIGHT	true	undefined	<FaAddressBookIcon />	undefined
XL	undefined	inherit	NORMAL	false	<FaAddressBookIcon />	undefined	6
M	undefined	TEXT_BLACK	LOOSE	false	undefined	<FaAddressBookIcon />	3
S	bold	TEXT_LINK	NONE	true	undefined	<FaAddressBookIcon />	4
XXS	bold	TEXT_GREY	undefined	true	undefined	<FaAddressBookIcon />	6
XL	bold	TEXT_DISABLED	NORMAL	true	undefined	<FaAddressBookIcon />	1
XL	bold	TEXT_WHITE	LOOSE	true	<FaAddressBookIcon />	undefined	2
XXS	normal	TEXT_WHITE	TIGHT	false	<FaAddressBookIcon />	undefined	5
undefined	undefined	TEXT_GREY	NONE	false	<FaAddressBookIcon />	undefined	undefined
S	normal	inherit	NORMAL	false	undefined	<FaAddressBookIcon />	5
M	normal	undefined	undefined	false	<FaAddressBookIcon />	undefined	2
XS	normal	TEXT_DISABLED	NONE	false	undefined	<FaAddressBookIcon />	2
L	bold	TEXT_BLACK	TIGHT	true	<FaAddressBookIcon />	undefined	3
undefined	bold	TEXT_BLACK	NORMAL	false	<FaAddressBookIcon />	undefined	4
XS	bold	TEXT_BLACK	undefined	true	<FaAddressBookIcon />	undefined	5
M	bold	inherit	TIGHT	true	undefined	<FaAddressBookIcon />	1
S	undefined	TEXT_DISABLED	TIGHT	false	<FaAddressBookIcon />	undefined	2
M	normal	TEXT_GREY	LOOSE	false	<FaAddressBookIcon />	undefined	4
undefined	bold	TEXT_WHITE	LOOSE	true	undefined	<FaAddressBookIcon />	6
L	undefined	TEXT_DISABLED	undefined	false	undefined	<FaAddressBookIcon />	undefined
L	undefined	undefined	NORMAL	false	<FaAddressBookIcon />	undefined	4
XXS	undefined	TEXT_LINK	NORMAL	false	<FaAddressBookIcon />	undefined	2
M	bold	TEXT_LINK	NORMAL	true	undefined	<FaAddressBookIcon />	undefined
XS	undefined	inherit	undefined	false	<FaAddressBookIcon />	undefined	3
undefined	normal	undefined	NONE	false	<FaAddressBookIcon />	undefined	3
XL	undefined	TEXT_WHITE	NONE	false	undefined	undefined	3
XXL	undefined	undefined	LOOSE	false	undefined	<FaAddressBookIcon />	1
S	normal	TEXT_WHITE	undefined	false	undefined	<FaAddressBookIcon />	undefined
undefined	undefined	TEXT_DISABLED	LOOSE	false	<FaAddressBookIcon />	undefined	5
S	normal	undefined	NONE	false	undefined	undefined	6
XXL	bold	TEXT_DISABLED	TIGHT	true	<FaAddressBookIcon />	undefined	4
XXS	bold	inherit	LOOSE	true	undefined	undefined	undefined
M	undefined	TEXT_WHITE	NONE	false	undefined	<FaAddressBookIcon />	1
XXL	normal	inherit	NONE	false	<FaAddressBookIcon />	undefined	2
XS	bold	undefined	TIGHT	false	undefined	<FaAddressBookIcon />	6
XXL	normal	TEXT_BLACK	NORMAL	false	undefined	undefined	undefined
XXL	bold	TEXT_GREY	NORMAL	true	undefined	undefined	3
XS	bold	TEXT_WHITE	NORMAL	true	undefined	undefined	4
S	bold	TEXT_LINK	LOOSE	true	undefined	<FaAddressBookIcon />	3
XS	bold	TEXT_LINK	NONE	false	undefined	<FaAddressBookIcon />	5
S	undefined	TEXT_BLACK	NONE	false	<FaAddressBookIcon />	undefined	1
XXS	bold	TEXT_DISABLED	undefined	true	undefined	<FaAddressBookIcon />	4
undefined	normal	inherit	TIGHT	false	<FaAddressBookIcon />	undefined	4
XL	normal	TEXT_GREY	undefined	false	undefined	undefined	5
XS	bold	TEXT_GREY	LOOSE	false	undefined	<FaAddressBookIcon />	undefined
L	normal	TEXT_LINK	NONE	false	<FaAddressBookIcon />	undefined	6
L	bold	TEXT_GREY	LOOSE	true	<FaAddressBookIcon />	undefined	1
XS	bold	TEXT_LINK	TIGHT	true	undefined	<FaAddressBookIcon />	1
S	bold	TEXT_GREY	TIGHT	true	undefined	<FaAddressBookIcon />	2
XXL	undefined	TEXT_BLACK	undefined	false	undefined	undefined	6
L	undefined	TEXT_WHITE	LOOSE	false	<FaAddressBookIcon />	undefined	2
XXS	undefined	undefined	NONE	false	undefined	<FaAddressBookIcon />	1
XXL	bold	TEXT_LINK	undefined	true	undefined	undefined	5
XL	normal	TEXT_LINK	undefined	false	undefined	undefined	4
XL	undefined	TEXT_BLACK	undefined	false	undefined	undefined	2
M	normal	TEXT_DISABLED	undefined	false	<FaAddressBookIcon />	undefined	6
L	undefined	inherit	undefined	false	undefined	<FaAddressBookIcon />	5
M	bold	undefined	LOOSE	true	<FaAddressBookIcon />	undefined	5
undefined	undefined	undefined	undefined	false	undefined	<FaAddressBookIcon />	2
XXL	bold	TEXT_WHITE	NONE	true	undefined	<FaAddressBookIcon />	4
XXS	undefined	TEXT_DISABLED	undefined	false	<FaAddressBookIcon />	undefined	3
XXS	bold	TEXT_BLACK	undefined	false	undefined	<FaAddressBookIcon />	undefined`
  .split('\n')
  .map((line) => {
    const [size, weight, color, leading, emphasis, prefixIcon, suffixIcon, maxLines] = line
      .split('\t')
      .map((c) => {
        switch (c) {
          case 'undefined':
            return undefined
          case 'true':
            return true
          case 'false':
            return false
          case '<FaAddressBookIcon />':
            return <FaAddressBookIcon />
        }

        if (typeof c === 'number') {
          return parseInt(c, 10)
        }
      })
    const result: ComponentProps<typeof Stack> = {
      size,
      weight,
      color,
      leading,
      emphasis,
      maxLines,
    }

    if (prefixIcon || suffixIcon) {
      result.icon = {
        prefix: prefixIcon,
        suffix: suffixIcon,
      }
    }

    return result
  })

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
