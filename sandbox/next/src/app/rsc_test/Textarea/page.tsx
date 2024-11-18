import React from 'react'
import { Textarea } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function TextareaPage() {
  return (
    <>
      <RSCChecker actualComponent={Textarea} />
      <Textarea />
    </>
  )
}
