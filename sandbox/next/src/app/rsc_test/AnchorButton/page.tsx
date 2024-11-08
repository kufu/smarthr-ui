import React from 'react'
import { AnchorButton } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function AnchorButtonPage() {
  return (
    <>
      <RSCChecker actualComponent={AnchorButton} />
      <AnchorButton href="/">AnchorButton</AnchorButton>
    </>
  )
}
