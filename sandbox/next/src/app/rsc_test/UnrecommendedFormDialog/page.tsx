import React from 'react'
import { UnrecommendedFormDialog } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function UnrecommendedFormDialogPage() {
  return (
    <>
      <RSCChecker actualComponent={UnrecommendedFormDialog} />
      <UnrecommendedFormDialog
        isOpen={true}
        actionText="actionText"
        title="title"
        onClickClose={() => {}}
        onSubmit={() => {}}
      />
    </>
  )
}
