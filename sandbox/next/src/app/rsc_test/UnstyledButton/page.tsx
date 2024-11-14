import React from 'react'
import { UnstyledButton } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function UnstyledButtonPage() {
  return (
    <>
      <RSCChecker actualComponent={UnstyledButton} />
      <UnstyledButton>Button</UnstyledButton>
    </>
  )
}
