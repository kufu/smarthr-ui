import React from 'react'
import { RangeSeparator } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function RangeSeparatorPage() {
  return (
    <>
      <RSCChecker actualComponent={RangeSeparator} />
      <RangeSeparator />
    </>
  )
}
