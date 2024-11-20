import React from 'react'
import { HeaderDropdownMenuButton } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function HeaderDropdownMenuButtonPage() {
  return (
    <>
      <RSCChecker actualComponent={HeaderDropdownMenuButton} />
      <HeaderDropdownMenuButton label="label">
        <div>children</div>
      </HeaderDropdownMenuButton>
    </>
  )
}
