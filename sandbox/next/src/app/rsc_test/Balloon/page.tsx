import React from 'react'
import { Balloon } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function BalloonPage() {
  return (
    <>
      <RSCChecker actualComponent={Balloon} />
      <Balloon>Balloon</Balloon>
    </>
  )
}
