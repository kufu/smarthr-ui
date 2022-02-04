import React from 'react'
import styled from 'styled-components'

import { Cluster, Heading, Stack, Text } from '../..'
import { HeadingTagTypes } from '../../components/Heading'

type Props = {
  /* 見出し */
  title: string
  /* 見出しとなる HTML 要素（h1–h6） */
  titleTag?: HeadingTagTypes
  /** 説明 */
  description?: string
  /** 操作群 */
  children?: React.ReactNode
}

/**
 * Monpei
 * 表札に呼び鈴、門扉、塀という家の顔である門塀。見出しとその操作、説明は利用者がまず目にするページの顔になります。
 */
export const Monpei: React.VFC<Props> = ({ title, description, children }) => (
  <Stack style={{ margin: '1.5em' }}>
    <Cluster align="center" justify="space-between">
      <Heading>{title}</Heading>
      {children && (
        <Actions>
          <Cluster justify="flex-end" gap={0.75}>
            {children}
          </Cluster>
        </Actions>
      )}
    </Cluster>
    {description && <Text>{description}</Text>}
  </Stack>
)
const Actions = styled.div`
  flex-grow: 1;
`
