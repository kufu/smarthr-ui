import React from 'react'
import { AppHeader } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker'
export default function AppHeaderPage() {
  return (
    <>
      <RSCChecker actualComponent={AppHeader} />
      <AppHeader />
    </>
  )
}
