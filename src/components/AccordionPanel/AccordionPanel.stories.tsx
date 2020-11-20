import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import React, { useState } from 'react'
import styled from 'styled-components'

import { Base } from '../Base'
import { AccordionPanel } from './AccordionPanel'
import { AccordionPanelItem } from './AccordionPanelItem'
import { AccordionPanelTrigger } from './AccordionPanelTrigger'
import { AccordionPanelContent } from './AccordionPanelContent'

import readme from './README.md'
import { SecondaryButton } from '../Button'

const arr = Array.from({ length: 3 })
// prettier-ignore
const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'

const AccordionPanelController = () => {
  const [expandedId, setExpandedId] = useState('')

  const Buttons = styled.div`
    margin-bottom: 16px;

    > *:not(:first-child) {
      margin-left: 16px;
    }
  `

  return (
    <Wrapper>
      <Buttons>
        {arr.map((_, i) => (
          <SecondaryButton
            key={`button-${i}`}
            onClick={() => setExpandedId(`accordion-panel-${i}`)}
            aria-controls={`accordion-panel-${i}-content`}
          >
            open {i}
          </SecondaryButton>
        ))}
      </Buttons>

      <Base>
        <AccordionPanel defaultExpanded={[expandedId]}>
          {arr.map((_, i) => (
            <AccordionPanelItem key={i} name={`accordion-panel-${i}`}>
              <AccordionPanelTrigger>AccordionPanelItem {i}</AccordionPanelTrigger>
              <AccordionPanelContent>
                <Content>
                  <div>{lorem}</div>
                </Content>
              </AccordionPanelContent>
            </AccordionPanelItem>
          ))}
        </AccordionPanel>
      </Base>
    </Wrapper>
  )
}

storiesOf('AccordionPanel', module)
  .addParameters({
    readme: {
      sidebar: readme,
    },
  })
  .add('Accordion style', () => (
    <Wrapper>
      <Base>
        <AccordionPanel>
          <BorderList>
            {arr.map((_, i) => (
              <li key={i}>
                <AccordionPanelItem name={`left-icon-${i}`}>
                  <AccordionPanelTrigger>Left Icon (default) {i}</AccordionPanelTrigger>
                  <AccordionPanelContent>
                    <Content>
                      <div>{lorem}</div>
                    </Content>
                  </AccordionPanelContent>
                </AccordionPanelItem>
              </li>
            ))}
          </BorderList>
        </AccordionPanel>
      </Base>
      <Base>
        <AccordionPanel iconPosition="right">
          <BorderList>
            {arr.map((_, i) => (
              <li key={i}>
                <AccordionPanelItem name={`right-icon-${i}`}>
                  <AccordionPanelTrigger>Right Icon {i}</AccordionPanelTrigger>
                  <AccordionPanelContent>
                    <Content>
                      <div>{lorem}</div>
                    </Content>
                  </AccordionPanelContent>
                </AccordionPanelItem>
              </li>
            ))}
          </BorderList>
        </AccordionPanel>
      </Base>
      <Base>
        <AccordionPanel displayIcon={false}>
          <BorderList>
            {arr.map((_, i) => (
              <li key={i}>
                <AccordionPanelItem name={`no-icon-${i}`}>
                  <AccordionPanelTrigger>No Icon {i}</AccordionPanelTrigger>
                  <AccordionPanelContent>
                    <Content>
                      <div>{lorem}</div>
                    </Content>
                  </AccordionPanelContent>
                </AccordionPanelItem>
              </li>
            ))}
          </BorderList>
        </AccordionPanel>
      </Base>
    </Wrapper>
  ))
  .add('Expanded options', () => (
    <Wrapper>
      <Base>
        <AccordionPanel displayIcon={true} expandableMultiply={true}>
          {arr.map((_, i) => (
            <AccordionPanelItem key={i} name={`expandable-multiply-${i}`}>
              <AccordionPanelTrigger>Expandable Multiply {i}</AccordionPanelTrigger>
              <AccordionPanelContent>
                <Content>
                  <div>{lorem}</div>
                </Content>
              </AccordionPanelContent>
            </AccordionPanelItem>
          ))}
        </AccordionPanel>
      </Base>
      <Base>
        <AccordionPanel displayIcon={true} defaultExpanded={['default-expanded-0']}>
          {arr.map((_, i) => (
            <AccordionPanelItem key={i} name={`default-expanded-${i}`}>
              <AccordionPanelTrigger>Default Expanded {i}</AccordionPanelTrigger>
              <AccordionPanelContent>
                <Content>
                  <div>{lorem}</div>
                </Content>
              </AccordionPanelContent>
            </AccordionPanelItem>
          ))}
        </AccordionPanel>
      </Base>
    </Wrapper>
  ))
  .add('Callback', () => (
    <Wrapper>
      <Base>
        <AccordionPanel displayIcon={false} expandableMultiply={true} onClick={action('Clicked')}>
          {arr.map((_, i) => (
            <AccordionPanelItem key={i} name={`expandable-multiply-${i}`}>
              <AccordionPanelTrigger>Expandable Multiply {i}</AccordionPanelTrigger>
              <AccordionPanelContent>
                <Content>
                  <div>{lorem}</div>
                </Content>
              </AccordionPanelContent>
            </AccordionPanelItem>
          ))}
        </AccordionPanel>
      </Base>
    </Wrapper>
  ))
  .add('Change defaultExpanded', () => <AccordionPanelController />)

const Wrapper = styled.div`
  padding: 24px;

  > *:not(:first-child) {
    margin-top: 24px;
  }
`
const BorderList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;

  > li:not(:first-child) {
    border-top: 1px solid #d6d6d6;
  }
`
const Content = styled.div`
  padding: 16px;
  background-color: #f9f9f9;
  color: #333;
  font-size: 14px;
`
