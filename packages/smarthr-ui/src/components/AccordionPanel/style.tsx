import React, { VFC } from 'react'

import { AccordionPanel, AccordionPanelContent, AccordionPanelItem, AccordionPanelTrigger } from '.'

export const Style: VFC = () => (
  <AccordionPanel>
    <AccordionPanelItem name="item1">
      <AccordionPanelTrigger>Trigger</AccordionPanelTrigger>
      <AccordionPanelContent>Content</AccordionPanelContent>
    </AccordionPanelItem>
  </AccordionPanel>
)
export const PREFIX = 'AccordionPanel'
