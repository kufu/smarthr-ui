import type { ChildNavigation, ChildNavigationGroup, Navigation } from '../../types'

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
