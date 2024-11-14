import React from 'react'
import { CurrencyInput } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function CurrencyInputPage() {
  return (
    <>
      <RSCChecker actualComponent={CurrencyInput} />
      <CurrencyInput name="name" />
    </>
  )
}
