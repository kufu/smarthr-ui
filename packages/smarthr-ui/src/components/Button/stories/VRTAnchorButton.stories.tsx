
import { BaseColumn } from '../../Base'
import { FaCaretDownIcon, FaCirclePlusIcon } from '../../Icon'
import { Cluster, Stack } from '../../Layout'
import { AnchorButton } from '../AnchorButton'

import type { StoryFn, StoryObj } from '@storybook/react-webpack5'
import type { ComponentProps } from 'react'

type Variant = ComponentProps<typeof AnchorButton>['variant']

/**
 * $ pict anchor-button.txt
 * size    disabled inactiveReason prefix suffix wide
 * s       true     なし           なし   なし   true
 * default false    なし           なし   あり   false
 * s       false    なし           あり   なし   false
 * default true     あり           なし   あり   false
 * s       false    なし           なし   あり   true
 * default true     あり           あり   なし   false
 * s       true     あり           あり   なし   false
 * default true     なし           あり   なし   true
 */
const _cases: Array<ComponentProps<typeof AnchorButton>> = [
  {
    size: 's',
    href: undefined,
    inactiveReason: undefined,
    prefix: undefined,
    suffix: undefined,
    wide: true,
  },
  {
    size: 'default',
    href: '#',
    inactiveReason: undefined,
    prefix: undefined,
    suffix: <FaCaretDownIcon />,
    wide: false,
  },
  {
    size: 's',
    href: '#',
    inactiveReason: undefined,
    prefix: <FaCirclePlusIcon />,
    suffix: undefined,
    wide: false,
  },
  {
    size: 'default',
    href: undefined,
    inactiveReason: { message: 'ボタンが無効な理由' },
    prefix: undefined,
    suffix: <FaCaretDownIcon />,
    wide: false,
  },
  {
    size: 's',
    href: '#',
    inactiveReason: undefined,
    prefix: undefined,
    suffix: <FaCaretDownIcon />,
    wide: true,
  },
  {
    size: 'default',
    href: undefined,
    inactiveReason: { message: 'ボタンが無効な理由' },
    prefix: <FaCirclePlusIcon />,
    suffix: undefined,
    wide: false,
  },
  {
    size: 's',
    href: undefined,
    inactiveReason: { message: 'ボタンが無効な理由' },
    prefix: <FaCirclePlusIcon />,
    suffix: undefined,
    wide: false,
  },
  {
    size: 'default',
    href: undefined,
    inactiveReason: undefined,
    prefix: <FaCirclePlusIcon />,
    suffix: undefined,
    wide: true,
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
  title: 'Components/Button/AnchorButton/VRT',
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
