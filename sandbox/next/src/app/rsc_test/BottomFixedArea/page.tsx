import React from 'react'
import { BottomFixedArea } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function BottomFixedAreaPage() {
  return (
    <>
      <RSCChecker actualComponent={BottomFixedArea} />
      <BottomFixedArea />
    </>
  )
}
