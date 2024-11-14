import React from 'react'
import { ThCheckbox } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function ThCheckboxPage() {
  return (
    <>
      <RSCChecker actualComponent={ThCheckbox} />
      <ThCheckbox />
    </>
  )
}
