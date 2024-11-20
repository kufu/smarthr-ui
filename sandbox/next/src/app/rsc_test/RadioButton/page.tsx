import React from 'react'
import { RadioButton } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function RadioButtonPage() {
  return (
    <>
      <RSCChecker actualComponent={RadioButton} />
      <RadioButton />
    </>
  )
}
