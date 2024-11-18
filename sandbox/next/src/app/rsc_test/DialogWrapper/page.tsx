import React from 'react'
import { DialogWrapper } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function DialogWrapperPage() {
  return (
    <>
      <RSCChecker actualComponent={DialogWrapper} />
      <DialogWrapper />
    </>
  )
}
