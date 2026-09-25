import React from 'react'
import { UnrecommendedActionDialog } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function UnrecommendedActionDialogPage() {
  return (
    <>
      <RSCChecker actualComponent={UnrecommendedActionDialog} />
      <UnrecommendedActionDialog
        title="title"
        actionText="actionText"
        onClickAction={() => {}}
        onClickClose={() => {}}
        isOpen
      />
    </>
  )
}
