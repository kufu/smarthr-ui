import React from 'react'
import { RemoteTriggerActionDialog } from 'smarthr-ui'
export default function RemoteTriggerActionDialogPage() {
  return (
    <>
      <div>Success: RemoteTriggerActionDialog</div>
      <RemoteTriggerActionDialog
        id="id"
        title="title"
        actionText="actionText"
        onClickAction={() => {}}
      />
    </>
  )
}
