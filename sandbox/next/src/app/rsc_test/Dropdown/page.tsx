import React from 'react'
import { Dropdown } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function DropdownPage() {
  return (
    <>
      <RSCChecker actualComponent={Dropdown} />
      <Dropdown />
    </>
  )
}
