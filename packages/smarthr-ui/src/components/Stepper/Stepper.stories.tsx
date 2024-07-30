import { StoryFn } from '@storybook/react'
import React from 'react'

import { Base, BaseColumn } from '../Base'
import { DefinitionList } from '../DefinitionList'
import { Heading } from '../Heading'
import { Center, Stack } from '../Layout'
import { ResponseMessage } from '../ResponseMessage'

import { HorizontalStep, VerticalStep } from './types'

import { Stepper } from '.'

export default {
  title: 'Forms（フォーム）/Stepper',
  component: Stepper,
}

const hSteps: HorizontalStep[] = [
  {
    label: '書類選考',
    status: 'completed',
  },
  {
    label: '一次選考',
    status: 'completed',
  },
  {
    label: '二次選考',
    status: {
      type: 'completed',
      text: '任意のステータスを入れられます',
    },
  },
  {
    label: '三次選考',
    status: 'closed',
  },
  {
    label: '最終選考',
  },
]
const vSteps: VerticalStep[] = [
  {
    label: '提出',
    status: 'completed',
    children: <DefinitionList items={[{ term: '申請者', description: '須磨 栄子' }]} />,
  },
  {
    label: '承認ステップ1',
    status: 'completed',
    children: (
      <Stack>
        <DefinitionList items={[{ term: '承認条件', description: '営業部に所属する1名が承認' }]} />
        <Base padding={1}>
          <BaseColumn>
            <p>
              <ResponseMessage type="warning">設定されていません。</ResponseMessage>
            </p>
          </BaseColumn>
        </Base>
      </Stack>
    ),
  },
  {
    label: '承認ステップ2',
    status: 'closed',
    children: (
      <DefinitionList items={[{ term: '承認条件', description: '営業部に所属する1名が承認' }]} />
    ),
  },
  {
    label: '4つめの VerticalStepper',
    children: <p>子要素</p>,
  },
]

export const Default: StoryFn = () => (
  <Stack gap={1.25}>
    <Stack gap={0.5} align="flex-start" as="section">
      <Heading type="blockTitle">横型</Heading>
      <Center>
        <Stepper type="horizontal" activeIndex={1} steps={hSteps} />
      </Center>
    </Stack>
    <Stack gap={0.5} as="section">
      <Heading type="blockTitle">縦型</Heading>
      <Stepper type="vertical" activeIndex={1} steps={vSteps} />
      <Stepper type="vertical" activeIndex={2} steps={vSteps} />
    </Stack>
  </Stack>
)
