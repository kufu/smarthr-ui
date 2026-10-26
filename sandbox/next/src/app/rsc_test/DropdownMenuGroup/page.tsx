import React from 'react'
import { DropdownMenuGroup } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function DropdownMenuGroupPage() {
  return (
    <>
      <RSCChecker actualComponent={DropdownMenuGroup} />
      <DropdownMenuGroup name="group">
        <div>children</div>
      </DropdownMenuGroup>
    </>
  )
}
