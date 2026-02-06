import { action } from 'storybook/actions'

import { Button } from '../../Button'
import { Stack } from '../../Layout'
import { Text } from '../../Text'
import { TextLink } from '../../TextLink'
import { NotificationBar } from '../NotificationBar'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

export const sampleChildrens = {
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
export const sampleSubActionAreas = {
  なし: undefined,
  ReactNode: <Button size="s">編集</Button>,
}
export const sampleOnCloseHandlers = {
  あり: () => {
    action('onClose')()
  },
  なし: undefined,
}

export default {
  title: 'Components/NotificationBar',
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
    children: 'String',
    role: 'alert',
    layer: 0,
    onClose: undefined,
    subActionArea: undefined,
  },
  argTypes: {
    children: {
      control: { type: 'radio' },
      options: Object.keys(sampleChildrens),
      mapping: sampleChildrens,
    },
    subActionArea: {
      control: { type: 'radio' },
      options: Object.keys(sampleSubActionAreas),
      mapping: sampleSubActionAreas,
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
  excludeStories: ['sampleChildrens', 'sampleSubActionAreas', 'sampleOnCloseHandlers'],
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

export const Children: StoryObj<typeof NotificationBar> = {
  name: 'children',
  render: (args) => (
    <Stack>
      <NotificationBar {...args}>NotificationBar が表示されました</NotificationBar>
      <NotificationBar {...args}>
        <Stack>
          <Text>任意の</Text>
          <Text>ReactNode</Text>
          <Text>を設定できます</Text>
        </Stack>
      </NotificationBar>
    </Stack>
  ),
}

export const SubActionArea: StoryObj<typeof NotificationBar> = {
  name: 'subActionArea',
  render: (args) => (
    <NotificationBar {...args} subActionArea={<Text>任意のReactNodeを設定できます</Text>} />
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
