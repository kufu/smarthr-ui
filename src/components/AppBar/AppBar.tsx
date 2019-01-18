import * as React from 'react'
import styled, { css } from 'styled-components'

import { SizePattern, ComponentProps, StyledProperties } from '../../types/componentProps'
import { withTheme, InjectedProps } from '../../hocs/withTheme'

type MergedComponentProps = ComponentProps<{}> & InjectedProps
type MergedStyledProps = StyledProperties & InjectedProps

const AppBarComponent: React.FC<MergedComponentProps> = ({ ...props }) => <Wrapper {...props} />

export const AppBar = withTheme(AppBarComponent)

const getSpaceSize = (size: SizePattern): 'xs' | 's' | 'm' => {
  const spaceMap: any = {
    xs: 'xs',
    s: 'xs',
    m: 's',
    l: 'm',
    xl: 'm',
  }
  return spaceMap[size]
}
const Wrapper: any = styled.div`
  ${({ spSize = 'm', pcSize = 'm', tabletSize = 'm', theme }: MergedStyledProps) => {
    const [pcPadding, tabletPadding, spPadding] = [pcSize, tabletSize, spSize]
      .map(getSpaceSize)
      .map(size => `0 ${theme.size.pxToRem(theme.size.space[size])}`)

    return css`
      padding: ${pcPadding};
      background: ${theme.palette.primary};

      @media screen and (max-width: ${theme.size.mediaQuery.tablet}px) {
        padding: ${tabletPadding};
      }

      @media screen and (max-width: ${theme.size.mediaQuery.sp}px) {
        padding: ${spPadding};
      }
    `
  }}
`
