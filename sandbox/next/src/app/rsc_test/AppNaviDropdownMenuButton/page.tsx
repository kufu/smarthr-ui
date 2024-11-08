import React from 'react'
import { AppNaviDropdownMenuButton } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function AppNaviDropdownMenuButtonPage() {
  return (
    <>
      <RSCChecker actualComponent={AppNaviDropdownMenuButton} />
      <AppNaviDropdownMenuButton label="label" />
    </>
  )
}
