import React from 'react'
import { TimePicker } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function TimePickerPage() {
  return (
    <>
      <RSCChecker actualComponent={TimePicker} />
      <TimePicker name="name" />
    </>
  )
}
