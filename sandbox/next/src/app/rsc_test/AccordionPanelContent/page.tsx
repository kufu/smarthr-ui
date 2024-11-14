import React from 'react'
import { AccordionPanelContent } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function AccordionPanelContentPage() {
  return (
    <>
      <RSCChecker actualComponent={AccordionPanelContent} />
      <AccordionPanelContent>AccordionPanelContent</AccordionPanelContent>
    </>
  )
}
