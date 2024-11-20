import React from 'react'
import { Select } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function SelectPage() {
  return (
    <>
      <RSCChecker actualComponent={Select} />
      <Select name="name" options={[]} />
    </>
  )
}
