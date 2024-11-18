import React from 'react'
import { FilterDropdown } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function FilterDropdownPage() {
  return (
    <>
      <RSCChecker actualComponent={FilterDropdown} />
      <FilterDropdown onApply={() => {}}>children</FilterDropdown>
    </>
  )
}
