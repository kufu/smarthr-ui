import React from 'react'
import { MessageDialog } from 'smarthr-ui'
export default function MessageDialogPage() {
  return (
    <>
      <div>Success: MessageDialog</div>
      <MessageDialog
        title="title"
        description="description"
        onClickClose={() => {}}
        isOpen={false}
      />
    </>
  )
}
