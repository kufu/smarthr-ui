import React from 'react'
import { FloatArea } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function FloatAreaPage() {
  return (
    <>
      <RSCChecker actualComponent={FloatArea} />
      <FloatArea primaryButton={<button type="button">button</button>} />
    </>
  )
}
