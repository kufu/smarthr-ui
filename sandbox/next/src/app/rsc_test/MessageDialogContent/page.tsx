import React from 'react'
import { MessageDialogContent } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function MessageDialogContentPage() {
  return (
    <>
      <RSCChecker actualComponent={MessageDialogContent} />
      <MessageDialogContent
        title="title"
        contentBgColor="white"
        description="description"
      />
    </>
  )
}
