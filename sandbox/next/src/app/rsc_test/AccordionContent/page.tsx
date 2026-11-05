import React from 'react'
import { AccordionContent } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function AccordionContentPage() {
  return (
    <>
      <RSCChecker actualComponent={AccordionContent} />
      <AccordionContent>AccordionContent</AccordionContent>
    </>
  )
}
