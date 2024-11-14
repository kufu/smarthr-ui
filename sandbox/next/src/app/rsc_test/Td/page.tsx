import React from 'react'
import { Td } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function TdPage() {
  return (
    <>
      <RSCChecker actualComponent={Td} />
      <Td>td</Td>
    </>
  )
}
