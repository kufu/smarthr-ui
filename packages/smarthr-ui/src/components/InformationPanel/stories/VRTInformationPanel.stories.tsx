import { Stack } from '../../Layout'
import { InformationPanel } from '../InformationPanel'

import type { Meta } from '@storybook/react-webpack5'
import type { ComponentProps } from 'react'

/**
 * $ pict information-panel.pict
 * type    bold   toggleable active
 * success false  true      true
 * info    false  false     false
 * error   true   false     true
 * sync    false  false     false
 * sync    false  true      false
 * success true   false     false
 * warning true   true      true
 * info    false  true      true
 * error   false  true      false
 * warning false  false     false
 * sync    false  false     true
 */
const _cases: Array<
  Pick<ComponentProps<typeof InformationPanel>, 'type' | 'bold' | 'toggleable' | 'active'>
> = [
  { type: 'success', bold: false, toggleable: true, active: true },
  { type: 'info', bold: false, toggleable: false, active: false },
  { type: 'error', bold: true, toggleable: false, active: true },
  { type: 'sync', bold: false, toggleable: false, active: false },
  { type: 'sync', bold: false, toggleable: true, active: false },
  { type: 'success', bold: true, toggleable: false, active: false },
  { type: 'warning', bold: true, toggleable: true, active: true },
  { type: 'info', bold: false, toggleable: true, active: true },
  { type: 'error', bold: false, toggleable: true, active: false },
  { type: 'warning', bold: false, toggleable: false, active: false },
  { type: 'sync', bold: false, toggleable: false, active: true },
]

export default {
  title: 'Components/InformationPanel/VRT',
  render: (args) => (
    <Stack>
      {_cases.map((props, index) => (
        <InformationPanel {...args} {...props} key={index} />
      ))}
    </Stack>
  ),
  args: {
    heading:
      '長い長い長い長い長い長い長い長い長い長い長い長い長い長い長い長い長い長い長い長い長い長い長い長い長い長い長い長い長い長い長いインフォメーションパネルタイトル',
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
