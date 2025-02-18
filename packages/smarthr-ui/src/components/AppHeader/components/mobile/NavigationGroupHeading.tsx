import React, { FC, useContext } from 'react'

import { NavigationGroup } from '../../types'

import { MenuSubHeading } from './MenuSubHeading'
import { NavigationContext } from './NavigationContext'

export const NavigationGroupHeading: FC<{
  currentNavigationGroup: NavigationGroup
}> = ({ currentNavigationGroup }) => {
  const { setSelectedNavigationGroup } = useContext(NavigationContext)

  return (
    <MenuSubHeading
      title={currentNavigationGroup.children}
      onClickBack={() => setSelectedNavigationGroup(null)}
    />
  )
}
