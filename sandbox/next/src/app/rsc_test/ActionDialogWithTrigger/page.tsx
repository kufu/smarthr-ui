import React from 'react'
import { ActionDialogWithTrigger } from 'smarthr-ui'
export default function ActionDialogWithTriggerPage() {
  return (
    <>
      <div>Success: ActionDialogWithTrigger</div>
      <ActionDialogWithTrigger
        contentBgColor="white"
        title="title"
        actionText="actionText"
        onClickAction={() => {}}
        trigger={<div>trigger</div>}
      />
    </>
  )
}
