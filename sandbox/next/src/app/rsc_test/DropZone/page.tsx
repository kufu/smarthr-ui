import React from 'react'
import { DropZone } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function DropZonePage() {
  return (
    <>
      <RSCChecker actualComponent={DropZone} />
      <DropZone name="name" onSelectFiles={() => {}} />
    </>
  )
}
