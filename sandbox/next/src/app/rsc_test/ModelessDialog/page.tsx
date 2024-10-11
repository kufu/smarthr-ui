import React from 'react'
import { ModelessDialog } from 'smarthr-ui'
export default function ModelessDialogPage() {
  return (
    <>
      <div>Success: ModelessDialog</div>
      <ModelessDialog header={<div>header</div>} isOpen={true} />
    </>
  )
}
