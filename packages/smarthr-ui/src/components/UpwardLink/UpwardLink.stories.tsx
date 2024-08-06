import React, { useCallback } from 'react'

import { Fieldset } from '../Fieldset'
import { PageHeading } from '../Heading'
import { Cluster, Stack } from '../Layout'
import { RadioButton } from '../RadioButton'

import { UpwardLink } from './UpwardLink'

import type { StoryFn } from '@storybook/react/*'

export default {
  title: 'Navigation（ナビゲーション）/UpwardLink',
  component: UpwardLink,
}

const Template: StoryFn = (args) => <UpwardLink {...args} href="/" />

export const Default = () => {
  const [indent, setIndent] = React.useState(true)
  const handleChange = useCallback(() => setIndent(!indent), [indent])
  return (
    <Stack>
      <Fieldset title="インデント">
        <Cluster gap={1}>
          <RadioButton name="indent" onChange={handleChange} checked={indent}>
            あり
          </RadioButton>
          <RadioButton name="indent" onChange={handleChange} checked={!indent}>
            なし
          </RadioButton>
        </Cluster>
      </Fieldset>
      <Stack className="shr-bg-background shr-p-2">
        <Template indent={indent}>権限一覧に戻る</Template>
        <PageHeading>権限詳細</PageHeading>
      </Stack>
    </Stack>
  )
}
