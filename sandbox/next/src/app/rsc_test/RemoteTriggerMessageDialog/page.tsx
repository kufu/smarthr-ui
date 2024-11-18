import React from 'react'
import { RemoteTriggerMessageDialog } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function RemoteTriggerMessageDialogPage() {
  return (
    <>
      <RSCChecker actualComponent={RemoteTriggerMessageDialog} />
      <RemoteTriggerMessageDialog title="title" description="description" id="id" />
    </>
  )
}
