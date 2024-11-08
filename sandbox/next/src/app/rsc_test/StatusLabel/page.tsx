import React from 'react'
import { StatusLabel } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function StatusLabelPage() {
  return (
    <>
      <RSCChecker actualComponent={StatusLabel} />
      <StatusLabel>StatusLabel</StatusLabel>
    </>
  )
}
