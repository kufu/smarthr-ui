import React from 'react'
import { SortDropdown } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function SortDropdownPage() {
  return (
    <>
      <RSCChecker actualComponent={SortDropdown} />
      <SortDropdown sortFields={[]} defaultOrder={'desc'} onApply={() => {}} />
    </>
  )
}
