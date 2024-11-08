import React from 'react'
import { DialogTrigger } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function DialogTriggerPage() {
  return (
    <>
      <RSCChecker actualComponent={DialogTrigger} />
      <DialogTrigger />
    </>
  )
}
