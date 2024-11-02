import React, { ComponentProps } from 'react'

import { Stack } from '../../Layout'
import { InformationPanel } from '../InformationPanel'

import type { Meta } from '@storybook/react'

/**
 * $ pict information-panel.pict
 * type    bold   togglable active
 * success false  true      true
 * infor   false  false     false
 * error   true   false     true
 * sync    false  false     false
 * sync    false  true      false
 * success true   false     false
 * warning true   true      true
 * infor   false  true      true
 * error   false  true      false
 * warning false  false     false
 * sync    false  false     true
 */
const _cases: Array<
  Pick<ComponentProps<typeof InformationPanel>, 'type' | 'bold' | 'togglable' | 'active'>
> = [
  { type: 'success', bold: false, togglable: true, active: true },
  { type: 'info', bold: false, togglable: false, active: false },
  { type: 'error', bold: true, togglable: false, active: true },
  { type: 'sync', bold: false, togglable: false, active: false },
  { type: 'sync', bold: false, togglable: true, active: false },
  { type: 'success', bold: true, togglable: false, active: false },
  { type: 'warning', bold: true, togglable: true, active: true },
  { type: 'info', bold: false, togglable: true, active: true },
  { type: 'error', bold: false, togglable: true, active: false },
  { type: 'warning', bold: false, togglable: false, active: false },
  { type: 'sync', bold: false, togglable: false, active: true },
]

export default {
  title: 'Data Display（データ表示）/InformationPanel/VRT',
  render: (args) => (
    <Stack>
      {_cases.map((props, index) => (
        <InformationPanel {...args} {...props} key={index} />
      ))}
    </Stack>
  ),
  args: {
    title: 'インフォメーションパネルタイトル',
    children: 'インフォメーションパネルボディ',
  },
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
} satisfies Meta<typeof InformationPanel>

export const VRT = {}

export const VRTForcedColors = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
