import React from 'react'
import { AppNaviButton } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function AppNaviButtonPage() {
  return (
    <>
      <RSCChecker actualComponent={AppNaviButton} />
      <AppNaviButton>AppNaviButton</AppNaviButton>
    </>
  )
}
