import React from 'react'
import { LineClamp } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function LineClampPage() {
  return (
    <>
      <RSCChecker actualComponent={LineClamp} />
      <LineClamp />
    </>
  )
}
