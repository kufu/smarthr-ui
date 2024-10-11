import React from 'react'
import { RemoteDialogTrigger } from 'smarthr-ui'
export default function RemoteDialogTriggerPage() {
  return (
    <>
      <div>Success: RemoteDialogTrigger</div>
      <RemoteDialogTrigger targetId="id">
        <button type="button">button</button>
      </RemoteDialogTrigger>
    </>
  )
}
