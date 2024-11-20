import React from 'react'
import { MonthPicker } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function MonthPickerPage() {
  return (
    <>
      <RSCChecker actualComponent={MonthPicker} />
      <MonthPicker name="name" />
    </>
  )
}
