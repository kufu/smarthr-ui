import React from 'react'
import { Heading } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function HeadingPage() {
  return (
    <>
      <RSCChecker actualComponent={Heading} />
      <Heading />
    </>
  )
}
