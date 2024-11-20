import React from 'react'
import { AccordionPanelItem } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function AccordionPanelItemPage() {
  return (
    <>
      <RSCChecker actualComponent={AccordionPanelItem} />
      <AccordionPanelItem name="AccordionPanelItem" />
    </>
  )
}
