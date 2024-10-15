import React from 'react'
import { ActionDialog } from 'smarthr-ui'
export default function ActionDialogPage() {
  return (
    <>
      <div>Success: ActionDialog</div>
      <ActionDialog
        title="title"
        actionText="actionText"
        onClickAction={() => {}}
        onClickClose={() => {}}
        isOpen
      />
    </>
  )
}
