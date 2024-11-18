import React from 'react'
import { DatePicker } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function DatePickerPage() {
  return (
    <>
      <RSCChecker actualComponent={DatePicker} />
      <DatePicker />
    </>
  )
}
