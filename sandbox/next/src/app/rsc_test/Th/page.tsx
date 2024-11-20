import React from 'react'
import { Th } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function ThPage() {
  return (
    <>
      <RSCChecker actualComponent={Th} />
      <Th>Th</Th>
    </>
  )
}
