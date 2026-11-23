import React from 'react'
import { Accordion } from 'smarthr-ui'

import { RSCChecker } from '../components/RSCChecker';
export default function AccordionPage() {
  return (
    <>
      <RSCChecker actualComponent={Accordion} />
      <Accordion />
    </>
  )
}
