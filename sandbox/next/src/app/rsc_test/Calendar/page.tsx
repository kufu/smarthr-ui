import React from 'react'
import { Calendar } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function CalendarPage() {
  return (
    <>
      <RSCChecker actualComponent={Calendar} />
      <Calendar onSelectDate={() => {}} />
    </>
  )
}
