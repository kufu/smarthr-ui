import React from 'react'
import { Chip } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function ChipPage() {
  return (
    <>
      <RSCChecker actualComponent={Chip} />
      <Chip>Chip</Chip>
    </>
  )
}
