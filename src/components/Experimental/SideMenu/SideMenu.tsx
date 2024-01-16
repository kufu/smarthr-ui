import React, { ComponentProps, FC, PropsWithChildren } from 'react'
import styled from 'styled-components'

import { Stack } from '../../Layout'

import { SideMenuGroup } from './SideMenuGroup'
import { SideMenuItem } from './SideMenuItem'
import { useClassNames } from './useClassNames'

type Props = PropsWithChildren
type ElementProps = ComponentProps<typeof Stack>
type SubComponents = {
  /** @deprecated SideMenu は削除予定です */
  Group: typeof SideMenuGroup
  /** @deprecated SideMenu は削除予定です */
  Item: typeof SideMenuItem
}

/** @deprecated SideMenu コンポーネントは 2024/01 に削除予定です。別コンポーネントで代替するか、UI を見直してください。 */
export const SideMenu: FC<Props & ElementProps> & SubComponents = ({
  children,
  className,
  ...props
}) => {
  const classNames = useClassNames()

  return (
    <StyledStack {...props} className={`${className || ''} ${classNames.wrapper}`}>
      {children}
    </StyledStack>
  )
}
SideMenu.Group = SideMenuGroup
SideMenu.Item = SideMenuItem

const StyledStack = styled(Stack).attrs({ forwardedAs: 'ul', inline: true, gap: 0.75 })``
