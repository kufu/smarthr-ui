import React from 'react'
import { Panel } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function BasePage() {
  return (
    <>
      <RSCChecker actualComponent={Panel} />
      <Panel />
    </>
  )
}
