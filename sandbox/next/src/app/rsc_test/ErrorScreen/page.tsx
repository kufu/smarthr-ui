import React from 'react'
import { ErrorScreen } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function ErrorScreenPage() {
  return (
    <>
      <RSCChecker actualComponent={ErrorScreen} />
      <ErrorScreen />
    </>
  )
}
