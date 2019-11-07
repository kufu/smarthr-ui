import { storiesOf } from '@storybook/react'
import React from 'react'
import styled from 'styled-components'

import { AccordionPanel } from './AccordionPanel'
import { AccordionPanelItem } from './AccordionPanelItem'
import { AccordionPanelTrigger } from './AccordionPanelTrigger'
import { AccordionPanelContent } from './AccordionPanelContent'
import { Base as BaseComponent } from '../Base'
import readme from './README.md'
import { action } from '@storybook/addon-actions'

const arr = Array.from({ length: 3 })
// prettier-ignore
const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'

storiesOf('AccordionPanel', module)
  .addParameters({
    readme: {
      sidebar: readme,
    },
  })
  .add('Accordion style', () => (
    <>
      <Base>
        <AccordionPanel onClick={action('click')}>
          <ul>
            {arr.map((_, index) => (
              <li className="border" key={index}>
                <AccordionPanelItem name={`left-icon-${index}`}>
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
        </AccordionPanel>
      </Base>
      <Base>
        <AccordionPanel iconPosition="right">
          <ul>
            {arr.map((_, index) => (
              <li className="border" key={index}>
                <AccordionPanelItem name={`right-icon-${index}`}>
                  <AccordionPanelTrigger>Right Icon {index}</AccordionPanelTrigger>
                  <AccordionPanelContent>
                    <Content>
                      <div>{lorem}</div>
                    </Content>
                  </AccordionPanelContent>
                </AccordionPanelItem>
              </li>
            ))}
          </ul>
        </AccordionPanel>
      </Base>
      <Base>
        <AccordionPanel displayIcon={false}>
          <ul>
            {arr.map((_, index) => (
              <li className="border" key={index}>
                <AccordionPanelItem name={`no-icon-${index}`}>
                  <AccordionPanelTrigger>No Icon {index}</AccordionPanelTrigger>
                  <AccordionPanelContent>
                    <Content>
                      <div>{lorem}</div>
                    </Content>
                  </AccordionPanelContent>
                </AccordionPanelItem>
              </li>
            ))}
          </ul>
        </AccordionPanel>
      </Base>
      <Base>
        <AccordionPanel displayIcon={false}>
          <ul>
            {arr.map((_, index) => (
              <li key={index}>
                <AccordionPanelItem name={`no-border-${index}`}>
                  <AccordionPanelTrigger>No Border {index}</AccordionPanelTrigger>
                  <AccordionPanelContent>
                    <Content>
                      <div>{lorem}</div>
                    </Content>
                  </AccordionPanelContent>
                </AccordionPanelItem>
              </li>
            ))}
          </ul>
        </AccordionPanel>
      </Base>
    </>
  ))
  .add('Expanded options', () => (
    <>
      <Base>
        <AccordionPanel displayIcon={true} expandableMultiply={true}>
          <ul>
            {arr.map((_, index) => (
              <li key={index}>
                <AccordionPanelItem name={`expandable-multiply-${index}`}>
                  <AccordionPanelTrigger>Expandable Multiply {index}</AccordionPanelTrigger>
                  <AccordionPanelContent>
                    <Content>
                      <div>{lorem}</div>
                    </Content>
                  </AccordionPanelContent>
                </AccordionPanelItem>
              </li>
            ))}
          </ul>
        </AccordionPanel>
      </Base>
      <Base>
        <AccordionPanel displayIcon={true} defaultExpanded={['default-expanded-0']}>
          <ul>
            {arr.map((_, index) => (
              <li className="" key={index}>
                <AccordionPanelItem name={`default-expanded-${index}`}>
                  <AccordionPanelTrigger>Default Expanded {index}</AccordionPanelTrigger>
                  <AccordionPanelContent>
                    <Content>
                      <div>{lorem}</div>
                    </Content>
                  </AccordionPanelContent>
                </AccordionPanelItem>
              </li>
            ))}
          </ul>
        </AccordionPanel>
      </Base>
    </>
  ))
  .add('Callback', () => (
    <Base>
      <AccordionPanel displayIcon={false} expandableMultiply={true} onClick={action('Clicked')}>
        <ul>
          {arr.map((_, index) => (
            <li key={index}>
              <AccordionPanelItem name={`expandable-multiply-${index}`}>
                <AccordionPanelTrigger>Expandable Multiply {index}</AccordionPanelTrigger>
                <AccordionPanelContent>
                  <Content>
                    <div>{lorem}</div>
                  </Content>
                </AccordionPanelContent>
              </AccordionPanelItem>
            </li>
          ))}
        </ul>
      </AccordionPanel>
    </Base>
  ))

const Base = styled(BaseComponent)`
  margin: 1rem;

  ul {
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
