import { storiesOf } from '@storybook/react'
import React, { useState } from 'react'

import { Accordion } from './Accordion'
import { AccordionTrigger } from './AccordionTrigger'
import { AccordionContent } from './AccordionContent'
import { Icon } from '../Icon'

storiesOf('Accordion', module).add('Accordion', () => {
  const [state, setstate] = useState('')
  const handleClick = (value: string, _expanded: boolean) => {
    setstate(value)
  }
  return (
    <>
      <Accordion name="accordion-0" expanded={state === 'accordion-0'} onClick={handleClick}>
        <AccordionTrigger prefix={<Icon name="fa-caret-up" />}>Accordion 0</AccordionTrigger>
        <AccordionContent>
          <div>Content of Accordion 0</div>
        </AccordionContent>
      </Accordion>
      <Accordion name="accordion-1" expanded={state === 'accordion-1'} onClick={handleClick}>
        <AccordionTrigger suffix={<Icon name="fa-caret-up" />}>Accordion 1</AccordionTrigger>
        <AccordionContent>
          <div>Content of Accordion 1</div>
        </AccordionContent>
      </Accordion>
      <Accordion name="accordion-2" expanded={state === 'accordion-2'} onClick={handleClick}>
        <AccordionTrigger>Accordion 2</AccordionTrigger>
        <AccordionContent>
          <div>Content of Accordion 2</div>
        </AccordionContent>
      </Accordion>
      <Accordion name="accordion-3" expanded={state === 'accordion-3'} onClick={handleClick}>
        <AccordionTrigger>Accordion 3</AccordionTrigger>
        <AccordionContent>
          <div>Content of Accordion 3</div>
        </AccordionContent>
      </Accordion>
    </>
  )
})
