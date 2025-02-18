import React, { memo, useCallback, useContext } from 'react'

import { NavigationGroup } from '../../types'

import { MenuSubHeader } from './MenuSubHeader'
import { NavigationContext } from './NavigationContext'

export const NavigationGroupHeader = memo<{
  title: NavigationGroup['children']
}>(({ title }) => {
  const { setSelectedNavigationGroup } = useContext(NavigationContext)
  const onClickBack = useCallback(
    () => setSelectedNavigationGroup(null),
    [setSelectedNavigationGroup],
  )

  return <MenuSubHeader title={title} onClickBack={onClickBack} />
})
