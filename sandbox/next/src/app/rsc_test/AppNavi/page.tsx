import React from 'react'
import { AppNavi } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function AppNaviPage() {
  return (
    <>
      <RSCChecker actualComponent={AppNavi} />
      <AppNavi />
    </>
  )
}
