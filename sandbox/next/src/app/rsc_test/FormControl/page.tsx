import React from 'react'
import { FormControl } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function FormControlPage() {
  return (
    <>
      <RSCChecker actualComponent={FormControl} />
      <FormControl title="title" />
    </>
  )
}
