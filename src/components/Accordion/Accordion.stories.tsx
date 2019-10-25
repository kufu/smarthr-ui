import { storiesOf } from '@storybook/react'
import React, { useState } from 'react'

import { Accordion } from './Accordion'
import { AccordionTrigger } from './AccordionTrigger'
import { AccordionContent } from './AccordionContent'

storiesOf('Accordion', module).add('Accordion', () => {
  const [state, setstate] = useState('')
  const handleClick = (value: string, expanded: boolean) => {
    console.log({ value, expanded })
    setstate(value)
  }
  return (
    <>
      <Accordion name="a" expanded={state === 'a'} onClick={handleClick}>
        <AccordionTrigger>hoge</AccordionTrigger>
        <AccordionContent>
          <div>AccordionContent Component</div>
        </AccordionContent>
      </Accordion>
      <Accordion name="b" expanded={state === 'b'} onClick={handleClick}>
        <AccordionTrigger>hoge</AccordionTrigger>
        <AccordionContent>
          <div>AccordionContent Component</div>
        </AccordionContent>
      </Accordion>
      <Accordion name="c" expanded={state === 'c'} onClick={handleClick}>
        <AccordionTrigger>hoge</AccordionTrigger>
        <AccordionContent>
          <div>AccordionContent Component</div>
        </AccordionContent>
      </Accordion>
      <Accordion name="d" expanded={state === 'd'} onClick={handleClick}>
        <AccordionTrigger>hoge</AccordionTrigger>
        <AccordionContent>
          <div>AccordionContent Component</div>
        </AccordionContent>
      </Accordion>
    </>
  )
})
