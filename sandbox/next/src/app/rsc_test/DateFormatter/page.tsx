import React from 'react'
import { DateFormatter } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker'
export default function DateFormatterPage() {
  return (
    <>
      <RSCChecker actualComponent={DateFormatter} />
      <DateFormatter date={new Date(2024, 10, 15)} />
    </>
  )
}
