import React from 'react'
import { Reel } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function ReelPage() {
  return (
    <>
      <RSCChecker actualComponent={Reel} />
      <Reel />
    </>
  )
}
