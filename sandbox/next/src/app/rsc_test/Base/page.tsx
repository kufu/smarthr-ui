import React from 'react'
import { Base } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function BasePage() {
  return (
    <>
      <RSCChecker actualComponent={Base} />
      <Base />
    </>
  )
}
