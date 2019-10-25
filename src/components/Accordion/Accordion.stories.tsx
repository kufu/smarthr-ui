import { storiesOf } from '@storybook/react'
import React, { useState } from 'react'

import { Accordion } from './Accordion'
import { AccordionTrigger } from './AccordionTrigger'
import { AccordionContent } from './AccordionContent'

storiesOf('Accordion', module).add('Accordion', () => {
  const [state, setstate] = useState('')
  const handleClick = (value: string) => () => {
    setstate(value)
  }
  return (
    <>
      <Accordion expanded={state === 'a'} onClick={handleClick('a')}>
        <AccordionTrigger>hoge</AccordionTrigger>
        <AccordionContent>
          <div>AccordionContent Component</div>
        </AccordionContent>
      </Accordion>
      <Accordion expanded={state === 'b'} onClick={handleClick('b')}>
        <AccordionTrigger>hoge</AccordionTrigger>
        <AccordionContent>
          <div>AccordionContent Component</div>
        </AccordionContent>
      </Accordion>
      <Accordion expanded={state === 'c'} onClick={handleClick('c')}>
        <AccordionTrigger>hoge</AccordionTrigger>
        <AccordionContent>
          <div>AccordionContent Component</div>
        </AccordionContent>
      </Accordion>
      <Accordion expanded={state === 'd'} onClick={handleClick('d')}>
        <AccordionTrigger>hoge</AccordionTrigger>
        <AccordionContent>
          <div>AccordionContent Component</div>
        </AccordionContent>
      </Accordion>
    </>
  )
})
