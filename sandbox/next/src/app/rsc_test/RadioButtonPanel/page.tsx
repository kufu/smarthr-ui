import React from 'react'
import { RadioButtonPanel } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function RadioButtonPanelPage() {
  return (
    <>
      <RSCChecker actualComponent={RadioButtonPanel} />
      <RadioButtonPanel />
    </>
  )
}
