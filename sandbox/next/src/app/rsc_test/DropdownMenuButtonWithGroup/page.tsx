import React from 'react'
import { DropdownMenuButton, DropdownMenuGroup } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker'

export default function DropdownMenuButtonWithGroupPage() {
  return (
    <>
      <RSCChecker actualComponent={DropdownMenuButton} />
      <DropdownMenuButton label="label">
        <DropdownMenuGroup name="group">
          <div>children</div>
        </DropdownMenuGroup>
      </DropdownMenuButton>
    </>
  )
}
