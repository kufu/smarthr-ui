import React from 'react'
import { DropdownCloser } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function DropdownCloserPage() {
  return (
    <>
      <RSCChecker actualComponent={DropdownCloser} />
      <DropdownCloser />
    </>
  )
}
