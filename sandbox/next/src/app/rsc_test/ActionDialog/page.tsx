import React from 'react'
import { ActionDialog } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function ActionDialogPage() {
  return (
    <>
      <RSCChecker actualComponent={ActionDialog} />
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
