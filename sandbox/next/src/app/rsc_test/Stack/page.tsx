import React from 'react'
import { Stack } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function StackPage() {
  return (
    <>
      <RSCChecker actualComponent={Stack} />
      <Stack />
    </>
  )
}
