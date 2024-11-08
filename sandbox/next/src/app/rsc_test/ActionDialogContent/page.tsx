import React from 'react'
import { ActionDialogContent } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function ActionDialogContentPage() {
  return (
    <>
      <RSCChecker actualComponent={ActionDialogContent} />
      <ActionDialogContent
        title="title"
        titleId="titleId"
        contentBgColor="white"
        actionText="actionText"
        onClickAction={() => {}}
      />
    </>
  )
}
