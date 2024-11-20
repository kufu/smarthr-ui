import React from 'react'
import { InputFile } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function InputFilePage() {
  return (
    <>
      <RSCChecker actualComponent={InputFile} />
      <InputFile name="name" label="label" />
    </>
  )
}
