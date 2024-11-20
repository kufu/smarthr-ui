import React from 'react'
import { WakuWakuButton } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker'
export default function WakuWakuButtonPage() {
  return (
    <>
      <RSCChecker actualComponent={WakuWakuButton} />
      <WakuWakuButton />
    </>
  )
}
