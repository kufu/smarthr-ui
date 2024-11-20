import React from 'react'
import { BaseColumn } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function BaseColumnPage() {
  return (
    <>
      <RSCChecker actualComponent={BaseColumn} />
      <BaseColumn />
    </>
  )
}
