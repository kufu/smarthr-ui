import React from 'react'
import { Tooltip } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function TooltipPage() {
  return (
    <>
      <RSCChecker actualComponent={Tooltip} />
      <Tooltip message="message" />
    </>
  )
}
