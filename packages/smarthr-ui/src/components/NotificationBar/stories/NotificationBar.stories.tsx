import { action } from '@storybook/addon-actions'
import React from 'react'

import { Button } from '../../Button'
import { Stack } from '../../Layout'
import { Text } from '../../Text'
import { TextLink } from '../../TextLink'
import { NotificationBar } from '../NotificationBar'

import type { Meta, StoryObj } from '@storybook/react'

export const sampleMessages = {
  String: 'NotificationBar が表示されました',
  ReactNode: (
    <>
      <Text>任意の ReactNode を設定できます</Text>
      <Button size="s">編集</Button>
      <TextLink href="#top">
        <Text size="S">ヘルプ</Text>
      </TextLink>
    </>
  ),
}
export const sampleOnCloseHandlers = {
  あり: () => {
    action('onClose')()
  },
  なし: undefined,
}

export default {
  title: 'States（状態）/NotificationBar',
  component: NotificationBar,
  render: (args) => (
    <div>
      <NotificationBar {...args} />
    </div>
  ),
  args: {
    base: 'none',
    animate: false,
    bold: false,
    type: 'success',
    message: 'String',
    role: 'alert',
    layer: 0,
    onClose: undefined,
  },
  argTypes: {
    message: {
      control: { type: 'radio' },
      options: Object.keys(sampleMessages),
      mapping: sampleMessages,
    },
    onClose: {
      control: { type: 'radio' },
      options: Object.keys(sampleOnCloseHandlers),
      mapping: sampleOnCloseHandlers,
    },
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  excludeStories: ['sampleMessages', 'sampleOnCloseHandlers'],
} as Meta<typeof NotificationBar>

export const Playground: StoryObj<typeof NotificationBar> = {
  args: {},
}

export const Base: StoryObj<typeof NotificationBar> = {
  name: 'base',
  render: (args) => (
    <Stack>
      <NotificationBar {...args} base="none" />
      <NotificationBar {...args} base="base" />
    </Stack>
  ),
}

export const Animate: StoryObj<typeof NotificationBar> = {
  name: 'animate',
  render: (args) => (
    <Stack>
      <NotificationBar {...args} animate={true} />
      <NotificationBar {...args} animate={false} />
    </Stack>
  ),
}

export const Bold: StoryObj<typeof NotificationBar> = {
  name: 'bold',
  render: (args) => (
    <Stack>
      <NotificationBar {...args} bold={true} />
      <NotificationBar {...args} bold={false} />
    </Stack>
  ),
}

export const Type: StoryObj<typeof NotificationBar> = {
  name: 'type',
  render: (args) => (
    <Stack>
      <NotificationBar {...args} type="success" />
      <NotificationBar {...args} type="error" />
      <NotificationBar {...args} type="info" />
      <NotificationBar {...args} type="warning" />
      <NotificationBar {...args} type="sync" />
    </Stack>
  ),
}

export const Message: StoryObj<typeof NotificationBar> = {
  name: 'message',
  render: (args) => (
    <Stack>
      <NotificationBar {...args} message="NotificationBar が表示されました" />
      <NotificationBar
        {...args}
        message={
          <Stack>
            <Text>任意の</Text>
            <Text>ReactNode</Text>
            <Text>を設定できます</Text>
          </Stack>
        }
      />
    </Stack>
  ),
}

export const Layer: StoryObj<typeof NotificationBar> = {
  name: 'layer',
  render: (args) => (
    <Stack>
      <NotificationBar {...args} base="base" layer={0} />
      <NotificationBar {...args} base="base" layer={1} />
      <NotificationBar {...args} base="base" layer={2} />
      <NotificationBar {...args} base="base" layer={3} />
      <NotificationBar {...args} base="base" layer={4} />
    </Stack>
  ),
}

export const OnClose: StoryObj<typeof NotificationBar> = {
  name: 'onClose',
  render: (args) => (
    <Stack>
      <NotificationBar {...args} onClose={action('onClose')} />
      <NotificationBar {...args} onClose={undefined} />
    </Stack>
  ),
}
