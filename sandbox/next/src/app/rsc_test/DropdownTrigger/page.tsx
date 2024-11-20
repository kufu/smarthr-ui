import React from 'react'
import { DropdownTrigger } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function DropdownTriggerPage() {
  return (
    <>
      <RSCChecker actualComponent={DropdownTrigger} />
      <DropdownTrigger />
    </>
  )
}
