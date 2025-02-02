import React, { FC, useCallback, useContext } from 'react'

import { NavigationGroup } from '../../types'

import { MenuSubHeader } from './MenuSubHeader'
import { NavigationContext } from './NavigationContext'

export const NavigationGroupHeader: FC<{
  title: NavigationGroup['children']
}> = ({ title }) => {
  const { setSelectedNavigationGroup } = useContext(NavigationContext)

  const onClickBack = useCallback(
    () => setSelectedNavigationGroup(null),
    [setSelectedNavigationGroup],
  )

  return <MenuSubHeader title={title} onClickBack={onClickBack} />
}
