import { memo, useCallback, useContext } from 'react'

import { MenuSubHeading } from './MenuSubHeading'
import { NavigationContext } from './NavigationContext'

import type { NavigationGroup } from '../../types'

export const NavigationGroupHeader = memo<{
  title: NavigationGroup['children']
}>(({ title }) => {
  const { setSelectedNavigationGroup } = useContext(NavigationContext)
  const onClickBack = useCallback(
    () => setSelectedNavigationGroup(null),
    [setSelectedNavigationGroup],
  )

  return <MenuSubHeading title={title} onClickBack={onClickBack} />
})
