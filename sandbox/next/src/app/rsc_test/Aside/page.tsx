import React from 'react'
import { Aside } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function AsidePage() {
  return (
    <>
      <RSCChecker actualComponent={Aside} />
      <Aside />
    </>
  )
}
