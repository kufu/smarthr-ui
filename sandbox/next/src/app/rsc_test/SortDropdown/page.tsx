import React from 'react'
import { SortDropdown } from 'smarthr-ui'
export default function SortDropdownPage() {
  return (
    <>
      <div>Success: SortDropdown</div>
      <SortDropdown sortFields={[]} defaultOrder={'desc'} onApply={() => {}} />
    </>
  )
}
