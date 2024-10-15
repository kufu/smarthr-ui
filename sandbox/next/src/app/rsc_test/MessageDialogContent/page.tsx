import React from 'react'
import { MessageDialogContent } from 'smarthr-ui'
export default function MessageDialogContentPage() {
  return (
    <>
      <div>Success: MessageDialogContent</div>
      <MessageDialogContent
        title="title"
        titleId="titleId"
        contentBgColor="white"
        description="description"
      />
    </>
  )
}
