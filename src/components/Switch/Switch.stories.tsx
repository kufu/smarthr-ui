import { action } from '@storybook/addon-actions'
import { StoryFn } from '@storybook/react'
import React from 'react'

import { Heading } from '../Heading'
import { Cluster, Stack } from '../Layout'
import { Section } from '../SectioningContent'

import { Switch } from '.'

export default {
  title: 'Forms（フォーム）/Switch',
  component: Switch,
}

export const Default: StoryFn = () => (
  <Stack gap={1.25}>
    <Section>
      <Stack gap={0.5} align="flex-start">
        <Heading type="blockTitle">標準</Heading>
        <Switch onChange={action('clicked')} />
      </Stack>
    </Section>
    <Section>
      <Stack gap={0.5} align="flex-start">
        <Heading type="blockTitle">デフォルト値変更</Heading>
        <Switch defaultChecked={true} onChange={action('clicked')} />
      </Stack>
    </Section>
    <Section>
      <Stack gap={0.5} align="flex-start">
        <Heading type="blockTitle">disabled</Heading>
        <Cluster>
          <Switch disabled onChange={action('clicked')} />
          <Switch disabled defaultChecked={true} onChange={action('clicked')} />
        </Cluster>
      </Stack>
    </Section>
    <p>※ 実際に使う場合には必ずラベルを指定してください。</p>
  </Stack>
)
