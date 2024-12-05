import React from 'react'
import { ActionDialogWithTrigger } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function ActionDialogWithTriggerPage() {
  return (
    <>
      <RSCChecker actualComponent={ActionDialogWithTrigger} />
      <ActionDialogWithTrigger
        contentBgColor="white"
        title="title"
        actionText="actionText"
        onClickAction={() => {}}
        trigger={<div>trigger</div>}
      />
    </>
  )
}
