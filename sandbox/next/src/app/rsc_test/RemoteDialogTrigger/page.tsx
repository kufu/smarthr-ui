import React from 'react'
import { RemoteDialogTrigger } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function RemoteDialogTriggerPage() {
  return (
    <>
      <RSCChecker actualComponent={RemoteDialogTrigger} />
      <RemoteDialogTrigger targetId="id">
        <button type="button">button</button>
      </RemoteDialogTrigger>
    </>
  )
}
