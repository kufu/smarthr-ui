import React from 'react'
import { FormDialog } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function FormDialogPage() {
  return (
    <>
      <RSCChecker actualComponent={FormDialog} />
      <FormDialog
        isOpen={true}
        actionText="actionText"
        title="title"
        onClickClose={() => {}}
        onSubmit={() => {}}
      />
    </>
  )
}
