import * as React from 'react'
import styled, { css } from 'styled-components'

import { InjectedProps, withTheme } from '../../hocs/withTheme'
import { ComponentProps, Size, StyledProperties } from '../../types/props'

type MergedComponentProps = ComponentProps & InjectedProps
type MergedStyledProps = StyledProperties & InjectedProps

const AppBarComponent: React.FC<MergedComponentProps> = ({ ...props }) => <Wrapper {...props} />

export const AppBar = withTheme(AppBarComponent)

const getSpaceSize = (size: Size): 'xs' | 's' | 'm' => {
  const spaceMap: any = {
    s: 'xs',
    m: 's',
    l: 'm',
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
      background: ${palette.SmartHRGreen};

      @media screen and (max-width: ${size.mediaQuery.tablet}px) {
        padding: ${tabletPadding};
      }

      @media screen and (max-width: ${size.mediaQuery.sp}px) {
        padding: ${spPadding};
      }
    `
  }}
`
