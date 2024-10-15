import { fireEvent, within } from '@storybook/test'
import React from 'react'

import { Stack } from '../../Layout'
import { NotificationBar } from '../NotificationBar'

import { sampleMessages, sampleOnCloseHandlers } from './NotificationBar.stories'

import type { StoryObj } from '@storybook/react'

export default {
  title: 'States（状態）/NotificationBar/VRT',
  /* ペアワイズ法による網羅
  base    bold    type      message     layer       onClose
  ---------------------------------------------------------
  base    true    warning   ReactNode   4           あり
  base    false   success   String      4           なし
  base    false   error     String      2           あり
  base    true    error     ReactNode   3           なし
  none    false   warning   String      undefined   なし
  base    false   error     ReactNode   1           あり
  base    true    info      String      1           なし
  base    true    sync      ReactNode   2           なし
  base    true    warning   ReactNode   2           あり
  base    false   sync      String      3           あり
  base    true    error     ReactNode   0           あり
  none    true    sync      ReactNode   undefined   あり
  base    false   warning   ReactNode   1           なし
  none    true    success   ReactNode   undefined   あり
  base    true    success   ReactNode   3           なし
  base    false   success   String      0           なし
  none    false   info      ReactNode   undefined   あり
  base    false   success   String      1           あり
  base    false   info      String      2           なし
  base    true    success   String      2           あり
  none    false   error     String      undefined   なし
  base    true    error     ReactNode   4           なし
  base    true    info      ReactNode   0           なし
  base    false   sync      ReactNode   0           なし
  base    true    sync      String      1           あり
  base    true    sync      String      4           あり
  base    true    info      String      3           あり
  base    true    info      String      4           なし
  base    false   warning   String      3           なし
  base    false   warning   String      0           あり
  base    true    error     ReactNode   undefined   あり
*/
  render: (args: any) => (
    <Stack {...args}>
      <NotificationBar
        base="base"
        bold={true}
        type="warning"
        message={sampleMessages.ReactNode}
        layer={4}
        onClose={sampleOnCloseHandlers.あり}
      />
      <NotificationBar
        base="base"
        bold={false}
        type="success"
        message={sampleMessages.String}
        layer={4}
        onClose={sampleOnCloseHandlers.なし}
      />
      <NotificationBar
        base="base"
        bold={false}
        type="error"
        message={sampleMessages.String}
        layer={2}
        onClose={sampleOnCloseHandlers.あり}
      />
      <NotificationBar
        base="base"
        bold={true}
        type="error"
        message={sampleMessages.ReactNode}
        layer={3}
        onClose={sampleOnCloseHandlers.なし}
      />
      <NotificationBar
        base="none"
        bold={false}
        type="warning"
        message={sampleMessages.String}
        layer={undefined}
        onClose={sampleOnCloseHandlers.なし}
      />
      <NotificationBar
        base="base"
        bold={false}
        type="error"
        message={sampleMessages.ReactNode}
        layer={1}
        onClose={sampleOnCloseHandlers.あり}
      />
      <NotificationBar
        base="base"
        bold={true}
        type="info"
        message={sampleMessages.String}
        layer={1}
        onClose={sampleOnCloseHandlers.なし}
      />
      <NotificationBar
        base="base"
        bold={true}
        type="sync"
        message={sampleMessages.ReactNode}
        layer={2}
        onClose={sampleOnCloseHandlers.なし}
      />
      <NotificationBar
        base="base"
        bold={true}
        type="warning"
        message={sampleMessages.ReactNode}
        layer={2}
        onClose={sampleOnCloseHandlers.あり}
      />
      <NotificationBar
        base="base"
        bold={false}
        type="sync"
        message={sampleMessages.String}
        layer={3}
        onClose={sampleOnCloseHandlers.あり}
      />
      <NotificationBar
        base="base"
        bold={true}
        type="error"
        message={sampleMessages.ReactNode}
        layer={0}
        onClose={sampleOnCloseHandlers.あり}
      />
      <NotificationBar
        base="none"
        bold={true}
        type="sync"
        message={sampleMessages.ReactNode}
        layer={undefined}
        onClose={sampleOnCloseHandlers.あり}
      />
      <NotificationBar
        base="base"
        bold={false}
        type="warning"
        message={sampleMessages.ReactNode}
        layer={1}
        onClose={sampleOnCloseHandlers.なし}
      />
      <NotificationBar
        base="none"
        bold={true}
        type="success"
        message={sampleMessages.ReactNode}
        layer={undefined}
        onClose={sampleOnCloseHandlers.あり}
      />
      <NotificationBar
        base="base"
        bold={true}
        type="success"
        message={sampleMessages.ReactNode}
        layer={3}
        onClose={sampleOnCloseHandlers.なし}
      />
      <NotificationBar
        base="base"
        bold={false}
        type="success"
        message={sampleMessages.String}
        layer={0}
        onClose={sampleOnCloseHandlers.なし}
      />
      <NotificationBar
        base="none"
        bold={false}
        type="info"
        message={sampleMessages.ReactNode}
        layer={undefined}
        onClose={sampleOnCloseHandlers.あり}
      />
      <NotificationBar
        base="base"
        bold={false}
        type="success"
        message={sampleMessages.String}
        layer={1}
        onClose={sampleOnCloseHandlers.あり}
      />
      <NotificationBar
        base="base"
        bold={false}
        type="info"
        message={sampleMessages.String}
        layer={2}
        onClose={sampleOnCloseHandlers.なし}
      />
      <NotificationBar
        base="base"
        bold={true}
        type="success"
        message={sampleMessages.String}
        layer={2}
        onClose={sampleOnCloseHandlers.あり}
      />
      <NotificationBar
        base="none"
        bold={false}
        type="error"
        message={sampleMessages.String}
        layer={undefined}
        onClose={sampleOnCloseHandlers.なし}
      />
      <NotificationBar
        base="base"
        bold={true}
        type="error"
        message={sampleMessages.ReactNode}
        layer={4}
        onClose={sampleOnCloseHandlers.なし}
      />
      <NotificationBar
        base="base"
        bold={true}
        type="info"
        message={sampleMessages.ReactNode}
        layer={0}
        onClose={sampleOnCloseHandlers.なし}
      />
      <NotificationBar
        base="base"
        bold={false}
        type="sync"
        message={sampleMessages.ReactNode}
        layer={0}
        onClose={sampleOnCloseHandlers.なし}
      />
      <NotificationBar
        base="base"
        bold={true}
        type="sync"
        message={sampleMessages.String}
        layer={1}
        onClose={sampleOnCloseHandlers.あり}
      />
      <NotificationBar
        base="base"
        bold={true}
        type="sync"
        message={sampleMessages.String}
        layer={4}
        onClose={sampleOnCloseHandlers.あり}
      />
      <NotificationBar
        base="base"
        bold={true}
        type="info"
        message={sampleMessages.String}
        layer={3}
        onClose={sampleOnCloseHandlers.あり}
      />
      <NotificationBar
        base="base"
        bold={true}
        type="info"
        message={sampleMessages.String}
        layer={4}
        onClose={sampleOnCloseHandlers.なし}
      />
      <NotificationBar
        base="base"
        bold={false}
        type="warning"
        message={sampleMessages.String}
        layer={3}
        onClose={sampleOnCloseHandlers.なし}
      />
      <NotificationBar
        base="base"
        bold={false}
        type="warning"
        message={sampleMessages.String}
        layer={0}
        onClose={sampleOnCloseHandlers.あり}
      />
      <NotificationBar
        base="base"
        bold={true}
        type="error"
        message={sampleMessages.ReactNode}
        layer={undefined}
        onClose={sampleOnCloseHandlers.あり}
      />
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
