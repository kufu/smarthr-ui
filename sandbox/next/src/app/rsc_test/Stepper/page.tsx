import React from 'react'
import { Stepper } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function StepperPage() {
  return (
    <>
      <RSCChecker actualComponent={Stepper} />
      <Stepper type="horizontal" steps={[]} />
    </>
  )
}
