import React, { HTMLAttributes, PropsWithChildren } from 'react'
import styled, { css } from 'styled-components'

import { useSpacing } from '../../hooks/useSpacing'
import { Center } from '../Layout'

import { Td } from './Td'

import type { Gap } from '../../types'

type Padding = Gap | { vertical?: Gap; horizontal?: Gap }

type Props = PropsWithChildren<{
  /** 境界とコンテンツの間の余白 */
  padding?: Padding
}>
type ElementProps = Omit<HTMLAttributes<HTMLTableSectionElement>, keyof Props>

export const EmptyTableBody: React.FC<Props & ElementProps> = ({
  children,
  padding = 4,
  ...props
}) => {
  return (
    <tbody {...props}>
      <tr>
        <StyledTd colSpan={1000} padding={padding}>
          <Center>{children}</Center>
        </StyledTd>
      </tr>
    </tbody>
  )
}

const StyledTd = styled(Td)<{ padding: Padding }>`
  ${({ padding }) => {
    if (padding instanceof Object) {
      return css`
        ${padding.vertical &&
        `
          padding-top: ${useSpacing(padding.vertical)};
          padding-bottom: ${useSpacing(padding.vertical)};
        `}
        ${padding.horizontal &&
        `
          padding-left: ${useSpacing(padding.horizontal)};
          padding-right: ${useSpacing(padding.horizontal)};
        `}
      `
    } else {
      return css`
        ${padding && `padding: ${useSpacing(padding)};`}
      `
    }
  }}
`
