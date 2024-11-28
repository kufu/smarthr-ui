import React from 'react'
import { DatetimeLocalPicker } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker'
export default function DatetimeLocalPickerPage() {
  return (
    <>
      <RSCChecker actualComponent={DatetimeLocalPicker} />
      <DatetimeLocalPicker name="name" />
    </>
  )
}
