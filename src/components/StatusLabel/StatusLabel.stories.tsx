import { Story } from '@storybook/react'
import * as React from 'react'
import styled, { css } from 'styled-components'

import { StatusLabel } from './StatusLabel'
import { Cluster, Stack } from '../Layout'

import readme from './README.md'

export default {
  title: 'StatusLabel',
  component: StatusLabel,
  parameters: {
    readme: {
      sidebar: readme,
    },
  },
}

export const All: Story = () => (
  <Wrapper>
    <Stack gap={0.5}>
      <dt>色の種類</dt>
      <Cluster as="dd">
        <StatusLabel>完了</StatusLabel>
        <StatusLabel type="blue">入力完了</StatusLabel>
        <StatusLabel type="green">入力中</StatusLabel>
        <StatusLabel type="red">入力必要</StatusLabel>
      </Cluster>
    </Stack>
    <Stack gap={0.5}>
      <dt>色の種類とその強調</dt>
      <Cluster as="dd">
        <StatusLabel bold>完了</StatusLabel>
        <StatusLabel type="blue" bold>
          入力完了
        </StatusLabel>
        <StatusLabel type="green" bold>
          確認中
        </StatusLabel>
        <StatusLabel type="red" bold>
          入力必要
        </StatusLabel>
      </Cluster>
    </Stack>
    <Stack gap={0.5}>
      <dt>特殊状態</dt>
      <Cluster as="dd">
        <StatusLabel type="warning">警告</StatusLabel>
        <StatusLabel type="error">エラー</StatusLabel>
      </Cluster>
    </Stack>
    <Stack gap={0.5}>
      <dt>特殊状態の強調</dt>
      <Cluster as="dd">
        <StatusLabel type="warning" bold>
          警告
        </StatusLabel>
        <StatusLabel type="error" bold>
          エラー
        </StatusLabel>
      </Cluster>
    </Stack>
  </Wrapper>
)
All.storyName = 'all'

const Wrapper = styled(Stack).attrs({ as: 'dl', gap: 1.5 })`
  ${({ theme: { spacingByChar } }) => css`
    margin-block: unset;
    padding: ${spacingByChar(1.5)};

    dd {
      margin-inline-start: unset;
    }
  `}
`
