import * as React from 'react'
import styled from 'styled-components'

import { SizePattern, ComponentProps, StyledProperties } from '../../types/componentProps'
import { withTheme, InjectedProps } from '../../hocs/withTheme'

type MergedComponentProps = ComponentProps<{}> & InjectedProps
type MergedStyledProps = StyledProperties & InjectedProps

const AppBar: React.SFC<MergedComponentProps> = ({ ...props }) => <Wrapper {...props} />

export default withTheme(AppBar)

const getSpace = (size: SizePattern): 'xs' | 's' | 'm' => {
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
  padding: ${({ pcSize = 'm', theme }: MergedStyledProps) =>
    `0 ${theme.size.pxToRem(theme.size.space[getSpace(pcSize)])}`};
  background: ${({ theme }: MergedStyledProps) => theme.palette.primary};

  @media screen and (max-width: ${({ theme }: MergedStyledProps) =>
      theme.size.mediaQuery.tablet}px) {
    padding: ${({ tabletSize = 'm', theme }: MergedStyledProps) =>
      `0 ${theme.size.pxToRem(theme.size.space[getSpace(tabletSize)])}`};
  }

  @media screen and (max-width: ${({ theme }: MergedStyledProps) => theme.size.mediaQuery.sp}px) {
    padding: ${({ spSize = 'm', theme }: MergedStyledProps) =>
      `0 ${theme.size.pxToRem(theme.size.space[getSpace(spSize)])}`};
  }
`
