import React from 'react'
import { FormDialog } from 'smarthr-ui'
export default function FormDialogPage() {
  return (
    <>
      <div>Success: FormDialog</div>
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
