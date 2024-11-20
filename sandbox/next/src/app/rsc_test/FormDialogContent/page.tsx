import React from 'react'
import { FormDialogContent } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function FormDialogContentPage() {
  return (
    <>
      <RSCChecker actualComponent={FormDialogContent} />
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
