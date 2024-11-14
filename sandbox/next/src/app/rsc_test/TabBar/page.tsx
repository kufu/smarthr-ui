import React from 'react'
import { TabBar } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function TabBarPage() {
  return (
    <>
      <RSCChecker actualComponent={TabBar} />
      <TabBar />
    </>
  )
}
