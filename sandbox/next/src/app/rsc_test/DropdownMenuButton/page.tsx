import React from 'react'
import { DropdownMenuButton } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function DropdownMenuButtonPage() {
  return (
    <>
      <RSCChecker actualComponent={DropdownMenuButton} />
      <DropdownMenuButton label="label">
        <div>children</div>
      </DropdownMenuButton>
    </>
  )
}
