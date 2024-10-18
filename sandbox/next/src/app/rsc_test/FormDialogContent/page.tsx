import React from 'react'
import { FormDialogContent } from 'smarthr-ui'
export default function FormDialogContentPage() {
  return (
    <>
      <div>Success: FormDialogContent</div>
      <FormDialogContent
        title="title"
        titleId="titleId"
        contentBgColor="white"
        actionText="actionText"
        onSubmit={() => {}}
      />
    </>
  )
}
