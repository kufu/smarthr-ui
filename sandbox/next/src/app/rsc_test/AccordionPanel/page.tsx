import React from 'react'
import { AccordionPanel } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function AccordionPanelPage() {
  return (
    <>
      <RSCChecker actualComponent={AccordionPanel} />
      <AccordionPanel />
    </>
  )
}
