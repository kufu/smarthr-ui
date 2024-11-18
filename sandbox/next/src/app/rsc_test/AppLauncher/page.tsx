import React from 'react'
import { AppLauncher } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function AppLauncherPage() {
  return (
    <>
      <RSCChecker actualComponent={AppLauncher} />
      <AppLauncher apps={[]} />
    </>
  )
}
