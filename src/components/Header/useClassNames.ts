import { useMemo } from 'react'

import { useClassNameGenerator } from '../../hooks/useClassNameGenerator'
import { Header } from './Header'

export function useClassNames() {
  const generate = useClassNameGenerator(Header.displayName || 'Header')
  return useMemo(
    () => ({
      wrapper: generate(),
      logoButton: generate('logoButton'),
      tenantName: generate('tenantName'),
      helpButton: generate('helpButton'),
      crewListButton: generate('crewListButton'),
      crewDropdownTrigger: generate('crewDropdownTrigger'),
      crewDropdown: generate('crewDropdown'),
      newCrewButton: generate('newCrewButton'),
      bulkInsertCrewsButton: generate('bulkInsertCrewsButton'),
      bulkUpdateCrewsButton: generate('bulkUpdateCrewsButton'),
      inviteCrewButton: generate('inviteCrewButton'),
      notificationButton: generate('notificationButton'),
      userDropdownTrigger: generate('userDropdownTrigger'),
      userDropdown: generate('userDropdown'),
      userDropdownDisplayName: generate('userDropdownDisplayName'),
      profileButton: generate('profileButton'),
      accountButton: generate('accountButton'),
      userDropdownTenantName: generate('userDropdownTenantName'),
      companyButton: generate('companyButton'),
      schoolButton: generate('schoolButton'),
      logoutButton: generate('logoutButton'),
    }),
    [generate],
  )
}
