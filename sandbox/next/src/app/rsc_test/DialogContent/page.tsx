import React from 'react'
import { DialogContent } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function DialogContentPage() {
  return (
    <>
      <RSCChecker actualComponent={DialogContent} />
      <DialogContent />
    </>
  )
}
