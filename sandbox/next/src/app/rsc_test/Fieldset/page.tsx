import React from 'react'
import { Fieldset } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker'
export default function FieldSetPage() {
  return (
    <>
      <RSCChecker actualComponent={Fieldset} />
      <Fieldset title="title" />
    </>
  )
}
