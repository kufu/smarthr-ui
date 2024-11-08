import React from 'react'
import { DialogCloser } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function DialogCloserPage() {
  return (
    <>
      <RSCChecker actualComponent={DialogCloser} />
      <DialogCloser />
    </>
  )
}
