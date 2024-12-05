import React from 'react'
import { TabItem } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker'
export default function TabItemPage() {
  return (
    <>
      <RSCChecker actualComponent={TabItem} />
      <TabItem id="id" onClick={() => {}} />
    </>
  )
}
