import type { CSSProperties } from 'react'
import type { Gap, SeparateGap } from '../type'
import styled, { css } from 'styled-components'
import { useSpacing } from '../../../hooks/useSpacing'

type Props = {
  align?: CSSProperties['alignItems']
  contentsMinWidth?: CSSProperties['minWidth']
  gap?: Gap | SeparateGap
  right?: boolean
}

export const Sidebar = styled.div<Props>(
  ({ align = 'stretch', contentsMinWidth = '50%', gap = 1, right }) => {
    const isGapSeparate = gap instanceof Object
    const gapValue = isGapSeparate
      ? css`
          row-gap: ${useSpacing(gap.row)};
          column-gap: ${useSpacing(gap.column)};
        `
      : css`
          gap: ${useSpacing(gap)};
        `
    const sidebarValue = css`
      flex-grow: 1;
    `
    const mainContentsValue = css`
      flex-basis: 0;
      flex-grow: 999;
      min-width: ${contentsMinWidth};
    `

    return css`
      display: flex;
      flex-wrap: wrap;
      align-items: ${align};
      ${gapValue}

      & > *:last-child {
        ${right ? sidebarValue : mainContentsValue}
      }

      & > *:first-child {
        ${right ? mainContentsValue : sidebarValue}
      }
    `
  },
)
