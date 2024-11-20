import { StoryFn } from '@storybook/react'
import React from 'react'

import { Base, BaseColumn } from '../Base'
import { DefinitionList } from '../DefinitionList'
import { Fieldset } from '../Fieldset'
import { FormControl } from '../FormControl'
import { Heading } from '../Heading'
import { Input } from '../Input'
import { Center, Stack } from '../Layout'
import { ResponseMessage } from '../ResponseMessage'

import { HorizontalStep, VerticalStep } from './types'

import { Stepper } from '.'

export default {
  title: 'Data Display（データ表示）/Stepper',
  component: Stepper,
}

const hSteps: HorizontalStep[] = [
  {
    label: 'カジュアル面談',
    status: 'completed',
  },
  {
    label: '書類選考',
    status: 'completed',
  },
  {
    label: '一次面接',
    status: {
      type: 'completed',
      text: '任意のステータスを入れられます',
    },
  },
  {
    label: '二次面接',
    status: 'closed',
  },
  {
    label: '最終面接',
  },
  {
    label: 'リファレンスチェック',
  },
  {
    label: 'オファー面談',
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
        <Base overflow="hidden">
          <BaseColumn>
            <p>
              <ResponseMessage type="info">承認済みのアカウントはありません。</ResponseMessage>
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
      <Stack>
        <DefinitionList items={[{ term: '承認条件', description: '営業部に所属する1名が承認' }]} />
        <Base overflow="hidden">
          <BaseColumn>
            <p>
              <ResponseMessage type="info">承認済みのアカウントはありません。</ResponseMessage>
            </p>
          </BaseColumn>
        </Base>
      </Stack>
    ),
  },
  {
    label: '完了',
    children: (
      <DefinitionList
        items={[
          {
            term: '承認設定',
            description: '承認設定なし。申請者がフォームを送信した時点で情報が反映されます。',
          },
        ]}
      />
    ),
  },
]

export const _Default: StoryFn = () => {
  const [activeIndex, setActiveIndex] = React.useState(0)
  return (
    <Stack gap={1.25}>
      <FormControl title="現在地（0始まり）">
        <Input
          type="number"
          name="activeIndex"
          value={activeIndex}
          onChange={({ target: { value } }) => setActiveIndex(Number(value))}
        />
      </FormControl>
      <Fieldset title="横型">
        <Center>
          <Stepper type="horizontal" activeIndex={activeIndex} steps={hSteps} />
        </Center>
      </Fieldset>
      <Fieldset title="縦型">
        <Stepper type="vertical" activeIndex={activeIndex} steps={vSteps} />
      </Fieldset>
    </Stack>
  )
}
