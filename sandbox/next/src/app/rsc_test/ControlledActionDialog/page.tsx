import React from 'react'
import { ControlledActionDialog } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker'

export default function ControlledActionDialogPage() {
  return (
    <>
      <RSCChecker actualComponent={ControlledActionDialog} />
      <ControlledActionDialog
        heading="heading"
        actionButton="action"
        onClickAction={() => {}}
        onClickClose={() => {}}
        isOpen
      >
        content
      </ControlledActionDialog>
    </>
  )
}
