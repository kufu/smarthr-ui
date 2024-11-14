import React from 'react'
import { RemoteTriggerActionDialog } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function RemoteTriggerActionDialogPage() {
  return (
    <>
      <RSCChecker actualComponent={RemoteTriggerActionDialog} />
      <RemoteTriggerActionDialog
        id="id"
        title="title"
        actionText="actionText"
        onClickAction={() => {}}
      />
    </>
  )
}
