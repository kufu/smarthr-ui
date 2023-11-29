import React, { ComponentProps, FC, PropsWithChildren } from 'react'
import styled from 'styled-components'

import { Stack } from '../../Layout'

import { SideMenuGroup } from './SideMenuGroup'
import { SideMenuItem } from './SideMenuItem'
import { useClassNames } from './useClassNames'

type Props = PropsWithChildren
type ElementProps = ComponentProps<typeof Stack>
type SubComponents = {
  Group: typeof SideMenuGroup
  Item: typeof SideMenuItem
}

export const SideMenu: FC<Props & ElementProps> & SubComponents = ({
  children,
  className,
  ...props
}) => {
  const classNames = useClassNames()

  return (
    <Wrapper {...props} className={`${className || ''} ${classNames.wrapper}`}>
      {children}
    </Wrapper>
  )
}
SideMenu.Group = SideMenuGroup
SideMenu.Item = SideMenuItem

const Wrapper = styled(Stack).attrs({ forwardedAs: 'ul', inline: true, gap: 0.75 })``
