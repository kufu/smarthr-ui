import React, { ComponentProps } from 'react'

import { BaseColumn } from '../../Base'
import { FaCaretDownIcon, FaCirclePlusIcon } from '../../Icon'
import { Cluster, Stack } from '../../Layout'
import { Button } from '../Button'

import type { StoryFn, StoryObj } from '@storybook/react'

type Variant = ComponentProps<typeof Button>['variant']

/**
 * $ pict button.pixt.txt /e:button-seeds.pict.txt
 * size    disabled disabledDetail  loading prefix suffix square  wide
 * default false    なし             false   あり    なし    false   false
 * default false    なし             false   なし    なし    true    false
 * s       false    なし             false   なし    あり    false   true
 * s       true     なし             false   あり    なし    false   true
 * default false    なし             true    なし    あり    false   true
 * default true     あり             false   なし    なし    true    false
 * s       false    なし             true    なし    なし    true    false
 * s       false    なし             true    あり    なし    false   false
 * s       true     あり             false   なし    あり    false   false
 * default true     あり             false   あり    なし    false   false
 */
const Template: StoryFn = (args) => (
  <Stack {...args}>
    {(['secondary', 'primary', 'danger', 'text', 'skeleton'] as Variant[]).map((variant) => (
      <BaseColumn bgColor={variant === 'skeleton' ? 'GREY_20' : 'WHITE'} key={variant}>
        <Cluster align="center">
          <Button variant={variant} prefix={<FaCirclePlusIcon />}>
            ボタン
          </Button>
          <Button variant={variant} square>
            <FaCirclePlusIcon alt="ボタン" />
          </Button>
          <Button variant={variant} size="s" suffix={<FaCaretDownIcon />} wide>
            ボタン
          </Button>
          <Button variant={variant} size="s" disabled prefix={<FaCirclePlusIcon />} wide>
            ボタン
          </Button>
          <Button variant={variant} loading suffix={<FaCaretDownIcon />} wide>
            ボタン
          </Button>
          <Button
            variant={variant}
            disabled
            disabledDetail={{ message: 'ボタンが無効な理由' }}
            square
          >
            <FaCirclePlusIcon alt="ボタン" />
          </Button>
          <Button variant={variant} size="s" loading square>
            <FaCirclePlusIcon alt="ボタン" />
          </Button>
          <Button variant={variant} size="s" loading prefix={<FaCirclePlusIcon />}>
            ボタン
          </Button>
          <Button
            variant={variant}
            size="s"
            disabled
            disabledDetail={{ message: 'ボタンが無効な理由' }}
            suffix={<FaCaretDownIcon />}
          >
            ボタン
          </Button>
          <Button
            variant={variant}
            disabled
            disabledDetail={{ message: 'ボタンが無効な理由' }}
            prefix={<FaCirclePlusIcon />}
          >
            ボタン
          </Button>
        </Cluster>
      </BaseColumn>
    ))}
  </Stack>
)

export default {
  title: 'Buttons（ボタン）/Button/VRT',
  render: Template,
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
}

export const VRT = {}

export const VRTHover = {
  render: () => (
    <>
      <Template id="hover" />
      <Template id="focus" />
      <Template id="focus-visible" />
      <Template id="active" />
    </>
  ),
  parameters: {
    pseudo: {
      hover: ['#hover .smarthr-ui-Button'],
      focus: ['#focus .smarthr-ui-Button'],
      focusVisible: ['#focus-visible .smarthr-ui-Button'],
      active: ['#active .smarthr-ui-Button'],
    },
  },
}

export const VRTForcedColors: StoryObj = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
