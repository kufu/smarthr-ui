import * as React from 'react'
import styled, { css } from 'styled-components'

import { ComponentProps, Size, StyledProperties } from '../../types/props'
import { useTheme } from '../../hooks/useTheme'

export const AppBar: React.FC<ComponentProps> = ({ ...props }) => {
  const theme = useTheme()
  return <Wrapper theme={theme} {...props} />
}

const getSpaceSize = (size: Size): 'XS' | 'S' | 'M' => {
  const spaceMap: any = {
    s: 'XS',
    m: 'S',
    l: 'M',
  }
  return spaceMap[size]
}
const Wrapper = styled.div<StyledProperties>`
  ${({ spSize = 'm', pcSize = 'm', tabletSize = 'm', theme }) => {
    const { size, palette } = theme
    const [pcPadding, tabletPadding, spPadding] = [pcSize, tabletSize, spSize]
      .map(getSpaceSize)
      .map(spaceSize => `0 ${size.pxToRem(size.space[spaceSize])}`)

    return css`
      padding: ${pcPadding};
      background: ${palette.MAIN};

      @media screen and (max-width: ${size.mediaQuery.TABLET}px) {
        padding: ${tabletPadding};
      }

      @media screen and (max-width: ${size.mediaQuery.SP}px) {
        padding: ${spPadding};
      }
    `
  }}
`
