import React from 'react'
import { Badge } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function BadgePage() {
  return (
    <>
      <RSCChecker actualComponent={Badge} />
      <Badge>Badge</Badge>
    </>
  )
}
