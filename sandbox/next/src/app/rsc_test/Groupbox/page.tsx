import React from 'react'
import { Groupbox } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function GroupboxPage() {
  return (
    <>
      <RSCChecker actualComponent={Groupbox} />
      <Groupbox />
    </>
  )
}
