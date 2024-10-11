import React from 'react'
import { ActionDialogContent } from 'smarthr-ui'
export default function ActionDialogContentPage() {
  return (
    <>
      <div>Success: ActionDialogContent</div>
      <ActionDialogContent
        title="title"
        titleId="titleId"
        contentBgColor="white"
        actionText="actionText"
        onClickAction={() => {}}
      />
    </>
  )
}
