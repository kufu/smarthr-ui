import { Stack } from '../../Layout'
import { NotificationBar } from '../NotificationBar'

import {
  sampleChildrens,
  sampleOnCloseHandlers,
  sampleSubActionAreas,
} from './NotificationBar.stories'

import type { StoryObj } from '@storybook/react-vite'

/* ペアワイズ法による網羅
paneled  bold   type     children   subActionArea  layer      onClose  */
const pairwisePatterns = `
true     false  error    String     ReactNode      1          no
true     true   error    ReactNode  undefined      2          yes
true     false  info     ReactNode  undefined      0          no
true     true   info     String     ReactNode      4          yes
true     true   success  String     ReactNode      0          yes
true     true   error    ReactNode  undefined      4          no
true     false  error    String     undefined      3          yes
true     true   info     ReactNode  ReactNode      3          no
false    true   warning  ReactNode  undefined      undefined  no
true     false  warning  String     ReactNode      4          yes
false    false  success  String     ReactNode      undefined  yes
true     true   sync     ReactNode  undefined      3          no
false    false  sync     String     ReactNode      undefined  yes
true     true   sync     String     undefined      4          no
true     false  info     String     undefined      undefined  no
true     true   info     ReactNode  undefined      1          yes
true     true   success  ReactNode  undefined      3          no
true     false  success  String     ReactNode      2          no
true     true   warning  String     undefined      0          yes
true     true   sync     String     undefined      2          no
false    true   error    String     undefined      undefined  no
true     true   error    String     undefined      0          yes
true     false  success  String     undefined      1          no
true     true   success  String     undefined      4          no
true     false  info     String     ReactNode      2          yes
true     true   sync     String     undefined      1          yes
true     false  warning  String     undefined      2          no
true     true   warning  String     undefined      1          yes
true     false  warning  ReactNode  undefined      3          yes
true     true   sync     String     undefined      0          no
false    true   info     String     undefined      undefined  yes
`
  .replace(/ +/g, ' ')
  .replace(/(^\n|\n$)/g, '')
  .split('\n')
  .map((l) => {
    const [paneled, bold, type, children, subActionArea, layer, onClose] = l.split(' ')

    return {
      paneled: paneled === 'true',
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
      {pairwisePatterns.map((ars, index) => (
        <NotificationBar {...ars} key={index} />
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
