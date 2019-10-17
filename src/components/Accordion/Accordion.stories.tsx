import { storiesOf } from '@storybook/react'
import React, { useState } from 'react'

import { Accordion } from './Accordion'
import { AccordionTrigger } from './AccordionTrigger'
import { AccordionContent } from './AccordionContent'

storiesOf('Accordion', module).add('Accordion', () => {
  const [state, setstate] = useState(new Map())
  const handleClick = (value: string) => () => {
    setstate(state.set(value, value))
    console.log(state)
  }
  return (
    <>
      <Accordion accordionKey="a" expanded={state.get('a')} onClick={handleClick('a')}>
        <AccordionTrigger>hoge</AccordionTrigger>
        <AccordionContent>
          <div>AccordionContent Component</div>
        </AccordionContent>
      </Accordion>
      <Accordion accordionKey="b" expanded={state.get('b')} onClick={handleClick('b')}>
        <AccordionTrigger>hoge</AccordionTrigger>
        <AccordionContent>
          <div>AccordionContent Component</div>
        </AccordionContent>
      </Accordion>
      <Accordion accordionKey="c" expanded={state.get('c')} onClick={handleClick('c')}>
        <AccordionTrigger>hoge</AccordionTrigger>
        <AccordionContent>
          <div>AccordionContent Component</div>
        </AccordionContent>
      </Accordion>
      <Accordion accordionKey="d" expanded={state.get('d')} onClick={handleClick('d')}>
        <AccordionTrigger>hoge</AccordionTrigger>
        <AccordionContent>
          <div>AccordionContent Component</div>
        </AccordionContent>
      </Accordion>
    </>
  )
})
