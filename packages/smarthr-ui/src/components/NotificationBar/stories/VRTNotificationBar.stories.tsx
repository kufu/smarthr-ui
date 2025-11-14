import { fireEvent, within } from 'storybook/test'

import { Stack } from '../../Layout'
import { NotificationBar } from '../NotificationBar'

import {
  sampleChildrens,
  sampleSubActionAreas,
  sampleOnCloseHandlers,
} from './NotificationBar.stories'

import type { StoryObj } from '@storybook/react'

/* ペアワイズ法による網羅
base  bold   type     children   subActionArea  layer      onClose  */
const pairwisePatterns = `
base  false  error    String     ReactNode      1          no
base  true   error    ReactNode  undefined      2          yes
base  false  info     ReactNode  undefined      0          no
base  true   info     String     ReactNode      4          yes
base  true   success  String     ReactNode      0          yes
base  true   error    ReactNode  undefined      4          no
base  false  error    String     undefined      3          yes
base  true   info     ReactNode  ReactNode      3          no
none  true   warning  ReactNode  undefined      undefined  no
base  false  warning  String     ReactNode      4          yes
none  false  success  String     ReactNode      undefined  yes
base  true   sync     ReactNode  undefined      3          no
none  false  sync     String     ReactNode      undefined  yes
base  true   sync     String     undefined      4          no
base  false  info     String     undefined      undefined  no
base  true   info     ReactNode  undefined      1          yes
base  true   success  ReactNode  undefined      3          no
base  false  success  String     ReactNode      2          no
base  true   warning  String     undefined      0          yes
base  true   sync     String     undefined      2          no
none  true   error    String     undefined      undefined  no
base  true   error    String     undefined      0          yes
base  false  success  String     undefined      1          no
base  true   success  String     undefined      4          no
base  false  info     String     ReactNode      2          yes
base  true   sync     String     undefined      1          yes
base  false  warning  String     undefined      2          no
base  true   warning  String     undefined      1          yes
base  false  warning  ReactNode  undefined      3          yes
base  true   sync     String     undefined      0          no
none  true   info     String     undefined      undefined  yes
`
  .replace(/ +/g, ' ')
  .replace(/(^\n|\n$)/g, '')
  .split('\n')
  .map((l) => {
    const [base, bold, type, children, subActionArea, layer, onClose] = l.split(' ')

    return {
      base,
      bold,
      type,
      children: children === 'String' ? sampleChildrens.String : sampleChildrens.ReactNode,
      subActionArea:
        subActionArea === 'ReactNode' ? sampleSubActionAreas.ReactNode : sampleSubActionAreas.なし,
      layer: layer === 'undefined' ? undefined : parseInt(layer, 10),
      onClose: onClose === 'yes' ? sampleOnCloseHandlers.あり : sampleOnCloseHandlers.なし,
    }
  })

export default {
  title: 'Components/NotificationBar/VRT',
  render: (args: any) => (
    <Stack {...args}>
      {pairwisePatterns.map((args) => (
        <NotificationBar {...args} />
      ))}
    </Stack>
  ),
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
}

export const VRT = {}

export const VRTNotificationBarFocus: StoryObj = {
  parameters: {
    pseudo: {
      focusVisible: ['.smarthr-ui-NotificationBar-closeButton'],
    },
  },
}

export const VRTForcedColors: StoryObj = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
