import { StoryFn } from '@storybook/react'
import React from 'react'
import styled from 'styled-components'

import { FaBellIcon } from '../Icon'
import { Cluster, Stack } from '../Layout'
import { Text } from '../Text'
import { VisuallyHiddenText } from '../VisuallyHiddenText'

import { Badge } from './Badge'

export default {
  title: 'States（状態）/Badge',
  component: Badge,
}

export const All: StoryFn = () => (
  <Stack as="dl" gap={3} className="shr-my-[unset] [&_dd]:shr-ms-[unset]">
    <Stack>
      <DtText>種類</DtText>
      <dd>
        <Stack align="flex-start">
          <Cluster gap={0.75} align="center">
            <Badge count={9} />
            <Badge count={100} />
          </Cluster>
          <p>
            <code>dot</code> を与えるとドットのみの表示になります。
            <code>count</code> を与えても無視します。
            <br />
            視覚情報しか持たないため、別途アクセシブルネームを与える必要があります。
          </p>
          <Cluster gap={0.75} align="center">
            <Badge dot />
            <VisuallyHiddenText>通知があります</VisuallyHiddenText>
            <Badge dot count={9} />
            <VisuallyHiddenText>通知があります</VisuallyHiddenText>
          </Cluster>
          <p>
            最大値の標準は99です。必要に応じて <code>overflowCount</code> で変えられます。
          </p>
          <Cluster gap={0.75}>
            <Badge count={1000} />
            <Badge count={1000} overflowCount={10} />
            <Badge count={1000} overflowCount={999} />
          </Cluster>
          <p>
            <code>children</code> を与えると、その右肩に表示します。
          </p>
          <Cluster gap={1.5}>
            <Badge count={9}>
              <FaBellIcon />
            </Badge>
            <Badge dot>
              <FaBellIcon />
            </Badge>
          </Cluster>
          <p>
            標準では<code>count=0</code>の場合は Badge を表示しません。<code>showZero</code>{' '}
            を与えると表示します。
          </p>
          <Cluster gap={0.75} align="center">
            <Badge count={0} />
            <Badge count={0} showZero />
            <Badge count={0}>
              <FaBellIcon />
            </Badge>
            <Badge count={0} showZero>
              <FaBellIcon />
            </Badge>
          </Cluster>
        </Stack>
      </dd>
    </Stack>
    <Stack>
      <DtText>色</DtText>
      <dd>
        <Cluster gap={1.5}>
          <Badge count={9} />
          <Badge count={9} type="grey" />
          <Badge count={9} type="yellow" />
          <Badge count={9} type="red" />
          <Badge dot />
          <Badge dot type="grey" />
          <Badge dot type="yellow" />
          <Badge dot type="red" />
        </Cluster>
      </dd>
    </Stack>
  </Stack>
)

const DtText = styled(Text).attrs({ forwardedAs: 'dt', weight: 'bold', color: 'TEXT_GREY' })``
