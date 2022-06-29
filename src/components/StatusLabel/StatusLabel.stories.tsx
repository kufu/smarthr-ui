import { Story } from '@storybook/react'
import * as React from 'react'
import styled, { css } from 'styled-components'

import { StatusLabel } from './StatusLabel'
import { Cluster, Stack } from '../Layout'

export default {
  title: 'StatusLabel',
  component: StatusLabel,
}

export const All: Story = () => (
  <Wrapper>
    <Stack gap={0.5}>
      <dt>色の種類</dt>
      <Cluster as="dd">
        <StatusLabel>ラベル名</StatusLabel>
        <StatusLabel type="blue">ラベル名</StatusLabel>
        <StatusLabel type="green">ラベル名</StatusLabel>
        <StatusLabel type="red">ラベル名</StatusLabel>
      </Cluster>
    </Stack>
    <Stack gap={0.5}>
      <dt>色の種類とその強調</dt>
      <Cluster as="dd">
        <StatusLabel bold>ラベル名</StatusLabel>
        <StatusLabel type="blue" bold>
          ラベル名
        </StatusLabel>
        <StatusLabel type="green" bold>
          ラベル名
        </StatusLabel>
        <StatusLabel type="red" bold>
          ラベル名
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
