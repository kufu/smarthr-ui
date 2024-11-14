import React from 'react'
import { AppNaviDropdown } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function AppNaviDropdownPage() {
  return (
    <>
      <RSCChecker actualComponent={AppNaviDropdown} />
      <AppNaviDropdown dropdownContent={<div>AppNaviDropdown</div>} />
    </>
  )
}
