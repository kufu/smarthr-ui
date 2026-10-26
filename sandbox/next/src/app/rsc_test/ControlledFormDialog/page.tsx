import React from 'react'
import { ControlledFormDialog } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker'

export default function ControlledFormDialogPage() {
  return (
    <>
      <RSCChecker actualComponent={ControlledFormDialog} />
      <ControlledFormDialog
        heading="heading"
        submitButton={{ text: 'submit' }}
        onSubmit={() => {}}
        onClickClose={() => {}}
        isOpen
      >
        content
      </ControlledFormDialog>
    </>
  )
}
