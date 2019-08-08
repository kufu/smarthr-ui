import * as React from 'react'
import styled, { css } from 'styled-components'

import { InjectedProps, withTheme } from '../../hocs/withTheme'
import { ComponentProps, Size, StyledProperties } from '../../types/props'

type MergedComponentProps = ComponentProps & InjectedProps
type MergedStyledProps = StyledProperties & InjectedProps

const AppBarComponent: React.FC<MergedComponentProps> = ({ ...props }) => <Wrapper {...props} />

export const AppBar = withTheme(AppBarComponent)

const getSpaceSize = (size: Size): 'XS' | 'S' | 'M' => {
  const spaceMap: any = {
    s: 'XS',
    m: 'S',
    l: 'M',
  }
  return spaceMap[size]
}
const Wrapper = styled.div`
  ${({ spSize = 'm', pcSize = 'm', tabletSize = 'm', theme }: MergedStyledProps) => {
    const { size, palette } = theme
    const [pcPadding, tabletPadding, spPadding] = [pcSize, tabletSize, spSize]
      .map(getSpaceSize)
      .map(spaceSize => `0 ${size.pxToRem(size.space[spaceSize])}`)

    return css`
      padding: ${pcPadding};
      background: ${palette.Main};

      @media screen and (max-width: ${size.mediaQuery.TABLET}px) {
        padding: ${tabletPadding};
      }

      @media screen and (max-width: ${size.mediaQuery.SP}px) {
        padding: ${spPadding};
      }
    `
  }}
`
