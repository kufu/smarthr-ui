import { ChildNavigation, ChildNavigationGroup, Navigation } from './types'

export const buildDisplayName = ({
  email,
  empCode,
  firstName,
  lastName,
}: {
  email?: string | null
  empCode?: string | null
  firstName?: string | null
  lastName?: string | null
}) => {
  const empCodeStr = empCode ? `（${empCode}）` : ''

  return (
    (firstName && lastName ? `${lastName} ${firstName}` + empCodeStr : empCode ? empCode : email) ??
    ''
  )
}

export const isChildNavigation = (
  navigation: Navigation | ChildNavigationGroup,
): navigation is ChildNavigation =>
  'href' in navigation || 'elementAs' in navigation || 'onClick' in navigation

export const isChildNavigationGroup = (
  navigation: Navigation | ChildNavigationGroup,
): navigation is ChildNavigationGroup =>
  navigation &&
  'childNavigations' in navigation &&
  'title' in navigation &&
  !('elementAs' in navigation)
