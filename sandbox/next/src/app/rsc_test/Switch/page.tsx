import React from 'react'
import { Switch } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function SwitchPage() {
  return (
    <>
      <RSCChecker actualComponent={Switch} />
      <Switch>children</Switch>
    </>
  )
}
