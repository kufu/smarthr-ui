import React from 'react'
import { Center } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function CenterPage() {
  return (
    <>
      <RSCChecker actualComponent={Center} />
      <Center />
    </>
  )
}
