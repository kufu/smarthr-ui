import { storiesOf } from '@storybook/react'
import React, { useState } from 'react'
import styled from 'styled-components'

import { AccordionPanelItem } from './AccordionPanelItem'
import { AccordionPanelTrigger } from './AccordionPanelTrigger'
import { AccordionPanelContent } from './AccordionPanelContent'
import { Base as BaseComponent } from '../Base'
import readme from './README.md'

const arr = Array.from({ length: 3 })
// prettier-ignore
const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nullap ariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'

storiesOf('AccordionPanel', module)
  .addParameters({
    readme: {
      sidebar: readme,
    },
  })
  .add('AccordionPanel', () => {
    const [state, setstate] = useState('')

    const handleClick = (name: string, _expanded: boolean) => {
      setstate(name)
    }

    return (
      <>
        <Base>
          <ul>
            {arr.map((_, index) => (
              <li className="border" key={index}>
                <AccordionPanelItem
                  name={`left-icon-${index}`}
                  expanded={state === `left-icon-${index}`}
                  onClick={handleClick}
                >
                  <AccordionPanelTrigger>Left Icon (default) {index}</AccordionPanelTrigger>
                  <AccordionPanelContent>
                    <Content>
                      <div>{lorem}</div>
                    </Content>
                  </AccordionPanelContent>
                </AccordionPanelItem>
              </li>
            ))}
          </ul>
        </Base>
        <Base>
          <ul>
            {arr.map((_, index) => (
              <li className="border" key={index}>
                <AccordionPanelItem
                  name={`right-icon-${index}`}
                  expanded={state === `right-icon-${index}`}
                  icon="right"
                  onClick={handleClick}
                >
                  <AccordionPanelTrigger>Right Icon {index}</AccordionPanelTrigger>
                  <AccordionPanelContent>
                    <Content>{lorem}</Content>
                  </AccordionPanelContent>
                </AccordionPanelItem>
              </li>
            ))}
          </ul>
        </Base>
        <Base>
          <ul>
            {arr.map((_, index) => (
              <li className="border" key={index}>
                <AccordionPanelItem
                  name={`no-icon-${index}`}
                  expanded={state === `no-icon-${index}`}
                  icon="none"
                  onClick={handleClick}
                >
                  <AccordionPanelTrigger>No Icon {index}</AccordionPanelTrigger>
                  <AccordionPanelContent>
                    <Content>{lorem}</Content>
                  </AccordionPanelContent>
                </AccordionPanelItem>
              </li>
            ))}
          </ul>
        </Base>
        <Base>
          <ul>
            {arr.map((_, index) => (
              <li key={index}>
                <AccordionPanelItem
                  name={`no-border-${index}`}
                  expanded={state === `no-border-${index}`}
                  icon="none"
                  onClick={handleClick}
                >
                  <AccordionPanelTrigger>No Border {index}</AccordionPanelTrigger>
                  <AccordionPanelContent>
                    <Content>{lorem}</Content>
                  </AccordionPanelContent>
                </AccordionPanelItem>
              </li>
            ))}
          </ul>
        </Base>
      </>
    )
  })

const Base = styled(BaseComponent)`
  margin: 1rem;

  > ul {
    margin: 0;
    padding: 0;
    list-style: none;

    > .border:not(:last-of-type) {
      border-bottom: 1px solid #d6d6d6;
    }
  }
`
const Content = styled.div`
  font-size: 14px;
  color: #333;
  background-color: #f9f9f9;
  padding: 1rem;
  text-align: justify;
`
