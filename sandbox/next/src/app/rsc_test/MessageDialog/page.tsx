import React from 'react'
import { MessageDialog } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function MessageDialogPage() {
  return (
    <>
      <RSCChecker actualComponent={MessageDialog} />
      <MessageDialog
        title="title"
        description="description"
        onClickClose={() => {}}
        isOpen={false}
      />
    </>
  )
}
