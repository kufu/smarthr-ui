import React from 'react'
import { UnrecommendedMessageDialog } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function UnrecommendedMessageDialogPage() {
  return (
    <>
      <RSCChecker actualComponent={UnrecommendedMessageDialog} />
      <UnrecommendedMessageDialog
        title="title"
        description="description"
        onClickClose={() => {}}
        isOpen={false}
      />
    </>
  )
}
