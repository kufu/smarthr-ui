import React, { PropsWithChildren } from 'react'
import styled, { css } from 'styled-components'

import { useSpacing } from '../../hooks/useSpacing'
import { Center, Gap } from '../Layout'

import { Td } from './Td'

type Props = PropsWithChildren<{
  /** 境界とコンテンツの間の余白 */
  padding?: Gap
}>

export const EmptyTableBody: React.FC<Props> = ({ children, padding = 4 }) => {
  return (
    <tbody>
      <tr>
        <StyledTd colSpan={1000} padding={padding}>
          <Center>{children}</Center>
        </StyledTd>
      </tr>
    </tbody>
  )
}

const StyledTd = styled(Td)<{ padding: Gap }>`
  ${({ padding }) => css`
    ${padding && `padding: ${useSpacing(padding)};`}
  `}
`
