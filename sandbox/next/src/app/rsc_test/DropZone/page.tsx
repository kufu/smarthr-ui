import React from 'react'
import { DropZone } from 'smarthr-ui'
export default function DropZonePage() {
  return (
    <>
      <div>Success: DropZone</div>
      <DropZone name="name" onSelectFiles={() => {}} />
    </>
  )
}
