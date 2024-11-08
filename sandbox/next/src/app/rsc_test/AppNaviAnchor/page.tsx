import React from 'react'
import { AppNaviAnchor } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function AppNaviAnchorPage() {
  return (
    <>
      <RSCChecker actualComponent={AppNaviAnchor} />
      <AppNaviAnchor href="/">AppNaviAnchor</AppNaviAnchor>
    </>
  )
}
