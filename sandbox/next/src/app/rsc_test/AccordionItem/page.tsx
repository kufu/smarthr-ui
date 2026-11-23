import React from 'react'
import { AccordionItem } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function AccordionItemPage() {
  return (
    <>
      <RSCChecker actualComponent={AccordionItem} />
      <AccordionItem name="AccordionItem" />
    </>
  )
}
