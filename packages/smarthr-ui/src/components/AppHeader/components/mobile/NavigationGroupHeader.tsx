import React, { FC, useContext } from 'react'

import { NavigationGroup } from '../../types'

import { MenuSubHeader } from './MenuSubHeader'
import { NavigationContext } from './NavigationContext'

export const NavigationGroupHeader: FC<{
  currentNavigationGroup: NavigationGroup
}> = ({ currentNavigationGroup }) => {
  const { setSelectedNavigationGroup } = useContext(NavigationContext)

  return (
    <MenuSubHeader
      title={currentNavigationGroup.children}
      onClickBack={() => setSelectedNavigationGroup(null)}
    />
  )
}
