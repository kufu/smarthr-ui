import React from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { Cluster } from '../Layout'
import { Text } from '../Text'

type Props = {
  start: number
  end: number
  total?: number
}

export const PageCounter: React.FC<Props> = ({ start, end, total = 0 }) => {
  const theme = useTheme()
  return (
    <Wrapper themes={theme}>
      {total > 0 && (
        <Wrapper forwardedAs="span" gap={0.25} themes={theme}>
          <Bold>{total.toLocaleString()}</Bold>
          件中
        </Wrapper>
      )}
      <Wrapper forwardedAs="span" gap={0.25} themes={theme}>
        <Bold>{start.toLocaleString()}</Bold>–<Bold>{end.toLocaleString()}</Bold>件
      </Wrapper>
    </Wrapper>
  )
}

const Wrapper = styled(Cluster).attrs({ align: 'baseline', inline: true })<{ themes: Theme }>`
  ${({ themes: { fontSize } }) => css`
    font-size: ${fontSize.M};
  `}
`
const Bold = styled(Text).attrs({ weight: 'bold', forwardedAs: 'b' })``
