import React from 'react'
import { AccordionPanelTrigger } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function AccordionPanelTriggerPage() {
  return (
    <>
      <RSCChecker actualComponent={AccordionPanelTrigger} />
      <AccordionPanelTrigger>AccordionPanelTrigger</AccordionPanelTrigger>
    </>
  )
}
