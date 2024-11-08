import React from 'react'
import { Dialog } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function DialogPage() {
  return (
    <>
      <RSCChecker actualComponent={Dialog} />
      <Dialog isOpen={true} />
    </>
  )
}
