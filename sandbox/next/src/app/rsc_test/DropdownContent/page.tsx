import React from 'react'
import { DropdownContent } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function DropdownContentPage() {
  return (
    <>
      <RSCChecker actualComponent={DropdownContent} />
      <DropdownContent />
    </>
  )
}
