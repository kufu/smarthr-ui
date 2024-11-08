import React from 'react'
import { TdCheckbox } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function TdCheckboxPage() {
  return (
    <>
      <RSCChecker actualComponent={TdCheckbox} />
      <TdCheckbox name="name" aria-labelledby="label" />
    </>
  )
}
