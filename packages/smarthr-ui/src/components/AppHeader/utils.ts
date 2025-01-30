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
  if (firstName && lastName) {
    return `${lastName} ${firstName}${empCode ? `（${empCode}）` : ''}`
  } else if (empCode) {
    return empCode
  } else if (email) {
    return email
  }

  return ''
}

export const isChildNavigation = (
  navigation: Navigation | ChildNavigationGroup,
): navigation is ChildNavigation =>
  'href' in navigation || 'elementAs' in navigation || 'onClick' in navigation

export const isChildNavigationGroup = (
  navigation: Navigation | ChildNavigationGroup | undefined,
): navigation is ChildNavigationGroup =>
  navigation &&
  'childNavigations' in navigation &&
  'title' in navigation &&
  !('elementAs' in navigation)
