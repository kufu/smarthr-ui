import React from 'react'
import { ControlledMessageDialog } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker'

export default function ControlledMessageDialogPage() {
  return (
    <>
      <RSCChecker actualComponent={ControlledMessageDialog} />
      <ControlledMessageDialog heading="heading" onClickClose={() => {}} isOpen>
        content
      </ControlledMessageDialog>
    </>
  )
}
