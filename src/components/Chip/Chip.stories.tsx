import { StoryFn } from '@storybook/react'
import React from 'react'
import styled from 'styled-components'

import { Cluster, Stack } from '../Layout'
import { Text } from '../Text'

import { Chip } from '.'

export default {
  title: 'Data Display（データ表示）/Chip',
  component: Chip,
}

export const All: StoryFn = () => (
  <Stack as="dl" gap={3}>
    <Stack>
      <DtText>Size</DtText>
      <dd>
        <Stack align="flex-start">
          <Chip label="XXS Label" size="XXS" />
          <Chip label="XS Label" size="XS" />
          <Chip label="S Label" size="S" />
          <div>
            <Chip label="M Label" />
            <span>（default）</span>
          </div>
          <Chip label="L Label" size="L" />
          <Chip label="XL Label" size="XL" />
          <Chip label="XXL Label" size="XXL" />
        </Stack>
      </dd>
      <DtText>In Cluster</DtText>
      <dd>
        <Cluster>
          <Chip label="S Label" size="S" />
          <Chip label="S Label" size="S" />
          <Chip label="S Label" size="S" />
          <Chip label="S Label" size="S" />
        </Cluster>
      </dd>
    </Stack>
  </Stack>
)

const DtText = styled(Text).attrs({ forwardedAs: 'dt', weight: 'bold', color: 'TEXT_GREY' })``
