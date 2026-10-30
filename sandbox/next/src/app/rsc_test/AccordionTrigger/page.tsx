import React from 'react'
import { AccordionTrigger } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function AccordionTriggerPage() {
  return (
    <>
      <RSCChecker actualComponent={AccordionTrigger} />
      <AccordionTrigger>AccordionTrigger</AccordionTrigger>
    </>
  )
}
