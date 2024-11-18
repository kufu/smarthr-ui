import React from 'react'
import { ModelessDialog } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function ModelessDialogPage() {
  return (
    <>
      <RSCChecker actualComponent={ModelessDialog} />
      <ModelessDialog header={<div>header</div>} isOpen={true} />
    </>
  )
}
