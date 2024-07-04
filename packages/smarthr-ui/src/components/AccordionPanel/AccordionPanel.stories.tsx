import { action } from '@storybook/addon-actions'
import { StoryFn } from '@storybook/react'
import React, { FC, useState } from 'react'
import styled from 'styled-components'

import { Base, BaseColumn } from '../Base'
import { Button } from '../Button'
import { FormControl } from '../FormControl'
import { Input } from '../Input'
import { Stack } from '../Layout'

import { AccordionPanel } from './AccordionPanel'
import { AccordionPanelContent } from './AccordionPanelContent'
import { AccordionPanelItem } from './AccordionPanelItem'
import { AccordionPanelTrigger } from './AccordionPanelTrigger'

export default {
  title: 'Data Display（データ表示）/AccordionPanel',
  component: AccordionPanel,
  subcomponents: {
    AccordionPanelItem,
    AccordionPanelContent,
    AccordionPanelTrigger,
  },
  parameters: {
    withTheming: true,
  },
}

const arr = Array.from({ length: 3 })
// prettier-ignore
const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
const content = () => {
  const id = Math.random()
  return (
    <Stack gap={0.75}>
      <div>{lorem}</div>
      <FormControl title="Name">
        <Input name={`name_${id}`} />
      </FormControl>
      <FormControl title="Email">
        <Input name={`email_${id}`} />
      </FormControl>
    </Stack>
  )
}

const AccordionPanelController: FC = () => {
  const [expandedId, setExpandedId] = useState('')

  const Buttons = styled.div`
    margin-bottom: 16px;

    > *:not(:first-child) {
      margin-left: 16px;
    }
  `

  return (
    <WrapperStack>
      <Buttons>
        {arr.map((_, i) => (
          <Button
            key={`button-${i}`}
            onClick={() => setExpandedId(`accordion-panel-${i}`)}
            aria-controls={`accordion-panel-${i}-content`}
          >
            open {i}
          </Button>
        ))}
      </Buttons>

      <Base>
        <AccordionPanel defaultExpanded={[expandedId]}>
          {arr.map((_, i) => (
            <AccordionPanelItem key={i} name={`accordion-panel-${i}`}>
              <AccordionPanelTrigger>AccordionPanelItem {i}</AccordionPanelTrigger>
              <AccordionPanelContent>
                <BaseColumn>{content()}</BaseColumn>
              </AccordionPanelContent>
            </AccordionPanelItem>
          ))}
        </AccordionPanel>
      </Base>
    </WrapperStack>
  )
}

export const AccordionStyle: StoryFn = () => (
  <WrapperStack>
    <Base>
      <AccordionPanel>
        {arr.map((_, i) => (
          <AccordionPanelItem name={`left-icon-${i}`} key={i}>
            <AccordionPanelTrigger>Left Icon (default) {i}</AccordionPanelTrigger>
            <AccordionPanelContent>
              <BaseColumn>{content()}</BaseColumn>
            </AccordionPanelContent>
          </AccordionPanelItem>
        ))}
      </AccordionPanel>
    </Base>
    <Base>
      <AccordionPanel iconPosition="right">
        {arr.map((_, i) => (
          <AccordionPanelItem name={`right-icon-${i}`} key={i}>
            <AccordionPanelTrigger>Right Icon {i}</AccordionPanelTrigger>
            <AccordionPanelContent>
              <BaseColumn>{content()}</BaseColumn>
            </AccordionPanelContent>
          </AccordionPanelItem>
        ))}
      </AccordionPanel>
    </Base>
  </WrapperStack>
)
AccordionStyle.storyName = 'Accordion style'

export const ExpandedOptions: StoryFn = () => (
  <WrapperStack>
    <Base>
      <AccordionPanel>
        {arr.map((_, i) => (
          <AccordionPanelItem key={i} name={`expandable-multiply-${i}`}>
            <AccordionPanelTrigger>Expandable Multiply {i}</AccordionPanelTrigger>
            <AccordionPanelContent>
              <BaseColumn>{content()}</BaseColumn>
            </AccordionPanelContent>
          </AccordionPanelItem>
        ))}
      </AccordionPanel>
    </Base>
    <Base>
      <AccordionPanel defaultExpanded={['default-expanded-0']} expandableMultiply={false}>
        {arr.map((_, i) => (
          <AccordionPanelItem key={i} name={`default-expanded-${i}`}>
            <AccordionPanelTrigger>Expandable Multiply Off {i}</AccordionPanelTrigger>
            <AccordionPanelContent>
              <BaseColumn>{content()}</BaseColumn>
            </AccordionPanelContent>
          </AccordionPanelItem>
        ))}
      </AccordionPanel>
    </Base>
  </WrapperStack>
)
ExpandedOptions.storyName = 'Expanded options'

export const Callback: StoryFn = () => (
  <Base>
    <AccordionPanel onClick={action('Clicked')}>
      {arr.map((_, i) => (
        <AccordionPanelItem key={i} name={`expandable-multiply-${i}`}>
          <AccordionPanelTrigger>Expandable Multiply {i}</AccordionPanelTrigger>
          <AccordionPanelContent>
            <BaseColumn>{content()}</BaseColumn>
          </AccordionPanelContent>
        </AccordionPanelItem>
      ))}
    </AccordionPanel>
  </Base>
)

export const ChangeDefaultExpanded: StoryFn = () => <AccordionPanelController />
ChangeDefaultExpanded.storyName = 'Change defaultExpanded'

const WrapperStack = styled(Stack).attrs({ gap: 1.5 })`
  padding: 24px;
`
