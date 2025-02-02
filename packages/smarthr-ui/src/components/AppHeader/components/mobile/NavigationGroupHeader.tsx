import React, { FC, useCallback, useContext } from 'react'

import { NavigationGroup } from '../../types'

import { MenuSubHeader } from './MenuSubHeader'
import { NavigationContext } from './NavigationContext'

export const NavigationGroupHeader: FC<{
  currentNavigationGroup: NavigationGroup
}> = ({ currentNavigationGroup }) => {
  const { setSelectedNavigationGroup } = useContext(NavigationContext)

  const onClickBack = useCallback(
    () => setSelectedNavigationGroup(null),
    [setSelectedNavigationGroup],
  )

  return <MenuSubHeader title={currentNavigationGroup.children} onClickBack={onClickBack} />
}
