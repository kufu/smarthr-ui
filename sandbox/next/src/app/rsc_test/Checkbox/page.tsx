import React from 'react'
import { Checkbox } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function CheckboxPage() {
  return (
    <>
      <RSCChecker actualComponent={Checkbox} />
      <Checkbox />
    </>
  )
}
