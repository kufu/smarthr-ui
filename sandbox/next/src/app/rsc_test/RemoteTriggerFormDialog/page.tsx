import React from 'react'
import { RemoteTriggerFormDialog } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function RemoteTriggerFormDialogPage() {
  return (
    <>
      <RSCChecker actualComponent={RemoteTriggerFormDialog} />
      <RemoteTriggerFormDialog title="title" onSubmit={() => {}} actionText="actionText" id="id" />
    </>
  )
}
