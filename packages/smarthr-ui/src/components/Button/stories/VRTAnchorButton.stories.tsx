import React, { ComponentProps } from 'react'

import { BaseColumn } from '../../Base'
import { FaCaretDownIcon, FaCirclePlusIcon } from '../../Icon'
import { Cluster, Stack } from '../../Layout'
import { AnchorButton } from '../AnchorButton'
import { Button } from '../Button'

import type { StoryFn, StoryObj } from '@storybook/react'

type Variant = ComponentProps<typeof Button>['variant']

/**
 * $ pict anchor-button.pixt.txt
 * size    disabled prefix suffix square  wide
 * s       true     なし    なし    false   false
 * default false    あり    なし    false   true
 * default true     なし    あり    false   true
 * s       false    なし    なし    true    false
 * default true     なし    なし    true    false
 * s       false    なし    あり    false   false
 * s       true     あり    なし    false   true
 * s       true     あり    なし    false   false
 */
const Template: StoryFn = (args) => (
  <Stack {...args}>
    {(['secondary', 'primary', 'danger', 'text', 'skeleton'] as Variant[]).map((variant) => (
      <BaseColumn bgColor={variant === 'skeleton' ? 'GREY_20' : 'WHITE'} key={variant}>
        <Cluster align="center">
          <AnchorButton variant={variant} size="s">
            ボタン
          </AnchorButton>
          <AnchorButton variant={variant} prefix={<FaCirclePlusIcon />} wide href="#">
            ボタン
          </AnchorButton>
          <AnchorButton variant={variant} suffix={<FaCaretDownIcon />} wide>
            ボタン
          </AnchorButton>
          <AnchorButton variant={variant} size="s" square href="#">
            <FaCirclePlusIcon alt="ボタン" />
          </AnchorButton>
          <AnchorButton variant={variant} square>
            <FaCirclePlusIcon alt="ボタン" />
          </AnchorButton>
          <AnchorButton variant={variant} size="s" suffix={<FaCaretDownIcon />} href="#">
            ボタン
          </AnchorButton>
          <AnchorButton variant={variant} size="s" prefix={<FaCirclePlusIcon />} wide>
            ボタン
          </AnchorButton>
          <AnchorButton variant={variant} size="s" prefix={<FaCirclePlusIcon />}>
            ボタン
          </AnchorButton>
        </Cluster>
      </BaseColumn>
    ))}
  </Stack>
)

export default {
  title: 'Buttons（ボタン）/Button/AnchorButton/VRT',
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
      hover: ['#hover .smarthr-ui-AnchorButton'],
      focus: ['#focus .smarthr-ui-AnchorButton'],
      focusVisible: ['#focus-visible .smarthr-ui-AnchorButton'],
      active: ['#active .smarthr-ui-AnchorButton'],
    },
  },
}

export const VRTForcedColors: StoryObj = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
