import { type FC, useContext } from 'react'

import { MenuSubHeader } from './MenuSubHeader'
import { NavigationContext } from './NavigationContext'

import type { NavigationGroup } from '../../types'

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
