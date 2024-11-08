import React from 'react'
import { Input } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function InputPage() {
  return (
    <>
      <RSCChecker actualComponent={Input} />
      <Input />
    </>
  )
}
