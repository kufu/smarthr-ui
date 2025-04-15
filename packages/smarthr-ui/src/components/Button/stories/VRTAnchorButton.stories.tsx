import { ComponentProps } from 'react'

import { BaseColumn } from '../../Base'
import { FaCaretDownIcon, FaCirclePlusIcon } from '../../Icon'
import { Cluster, Stack } from '../../Layout'
import { AnchorButton } from '../AnchorButton'
import { Button } from '../Button'

import type { StoryFn, StoryObj } from '@storybook/react'

type Variant = ComponentProps<typeof Button>['variant']

/**
 * $ pict anchor-button.txt
 * size    disabled disabledDetail prefix suffix wide
 * default true     あり           なし   なし   false
 * s       false    なし           なし   あり   true
 * s       true     なし           なし   あり   false
 * default false    なし           なし   なし   false
 * default true     なし           なし   あり   true
 * s       true     なし           あり   なし   true
 * s       true     あり           なし   あり   false
 * default true     あり           あり   なし   false
 * s       true     あり           なし   なし   false
 * s       false    なし           あり   なし   false
 */
const _cases: Array<ComponentProps<typeof AnchorButton>> = [
  {
    size: 'default',
    href: undefined,
    disabledDetail: { message: 'ボタンが無効な理由' },
    prefix: undefined,
    suffix: undefined,
    wide: false,
  },
  {
    size: 's',
    href: '#',
    disabledDetail: undefined,
    prefix: undefined,
    suffix: <FaCaretDownIcon />,
    wide: true,
  },
  {
    size: 's',
    href: undefined,
    disabledDetail: undefined,
    prefix: undefined,
    suffix: <FaCaretDownIcon />,
    wide: false,
  },
  {
    size: 'default',
    href: '#',
    disabledDetail: undefined,
    prefix: undefined,
    suffix: undefined,
    wide: false,
  },
  {
    size: 'default',
    href: undefined,
    disabledDetail: undefined,
    prefix: undefined,
    suffix: <FaCaretDownIcon />,
    wide: true,
  },
  {
    size: 's',
    href: undefined,
    disabledDetail: undefined,
    prefix: <FaCirclePlusIcon />,
    suffix: undefined,
    wide: true,
  },
  {
    size: 's',
    href: undefined,
    disabledDetail: { message: 'ボタンが無効な理由' },
    prefix: undefined,
    suffix: <FaCaretDownIcon />,
    wide: false,
  },
  {
    size: 'default',
    href: undefined,
    disabledDetail: { message: 'ボタンが無効な理由' },
    prefix: <FaCirclePlusIcon />,
    suffix: undefined,
    wide: false,
  },
  {
    size: 's',
    href: undefined,
    disabledDetail: { message: 'ボタンが無効な理由' },
    prefix: undefined,
    suffix: undefined,
    wide: false,
  },
  {
    size: 's',
    href: '#',
    disabledDetail: undefined,
    prefix: <FaCirclePlusIcon />,
    suffix: undefined,
    wide: false,
  },
]

const Template: StoryFn<typeof AnchorButton> = (args) => (
  <Stack>
    {[undefined, 'hover', 'focus-visible'].map((id) => (
      <Stack id={id} key={id}>
        {(['secondary', 'primary', 'danger', 'text', 'skeleton'] as Variant[]).map((variant) => (
          <BaseColumn bgColor={variant === 'skeleton' ? 'GREY_20' : 'WHITE'} key={variant}>
            <Cluster align="center">
              {_cases.map((props, index) => (
                <AnchorButton {...args} {...props} variant={variant} key={index} />
              ))}
            </Cluster>
          </BaseColumn>
        ))}
      </Stack>
    ))}
  </Stack>
)

export default {
  title: 'Buttons（ボタン）/Button/AnchorButton/VRT',
  render: Template,
  args: {
    children: 'ボタン',
  },
  parameters: {
    pseudo: {
      hover: ['#hover .smarthr-ui-AnchorButton'],
      focusVisible: ['#focus-visible .smarthr-ui-AnchorButton'],
    },
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
}

export const VRT = {}

export const VRTForcedColors: StoryObj = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
