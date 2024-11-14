import React from 'react'
import { PageCounter } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function PageCounterPage() {
  return (
    <>
      <RSCChecker actualComponent={PageCounter} />
      <PageCounter start={0} end={0} />
    </>
  )
}
