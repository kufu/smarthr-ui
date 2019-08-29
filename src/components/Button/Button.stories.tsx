import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'
import { PrimaryButton, PrimaryButtonAnchor } from './PrimaryButton'
import { Icon } from '../Icon'

storiesOf('Button', module).add('all', () => (
  <>
    <Wrapper>
      Default
      <List>
        <li>
          <PrimaryButton onClick={action('clicked')}>Button</PrimaryButton>
          <PrimaryButtonAnchor href="#">Anchor</PrimaryButtonAnchor>
          <PrimaryButton disabled={true}>Disabled</PrimaryButton>
        </li>
      </List>
      With icon (Left)
      <List>
        <li>
          <PrimaryButton
            prefix={<Icon size={14} name="fa-plus-circle" />}
            onClick={action('clicked')}
          >
            Button
          </PrimaryButton>
          <PrimaryButtonAnchor prefix={<Icon size={14} name="fa-plus-circle" />} href="#">
            Anchor
          </PrimaryButtonAnchor>
          <PrimaryButton prefix={<Icon size={14} name="fa-plus-circle" />} disabled={true}>
            Disabled
          </PrimaryButton>
        </li>
      </List>
      With icon (Right)
      <List>
        <li>
          <PrimaryButton
            suffix={<Icon size={14} name="fa-plus-circle" />}
            onClick={action('clicked')}
          >
            Button
          </PrimaryButton>
          <PrimaryButtonAnchor suffix={<Icon size={14} name="fa-plus-circle" />} href="#">
            Anchor
          </PrimaryButtonAnchor>
          <PrimaryButton suffix={<Icon size={14} name="fa-plus-circle" />} disabled={true}>
            Disabled
          </PrimaryButton>
        </li>
      </List>
      Only icon
      <List>
        <li>
          <PrimaryButton onClick={action('clicked')} square>
            <Icon size={16} name="fa-plus-circle" />
          </PrimaryButton>
          <PrimaryButtonAnchor href="#" square>
            <Icon size={16} name="fa-plus-circle" />
          </PrimaryButtonAnchor>
          <PrimaryButton disabled={true} square>
            <Icon size={16} name="fa-plus-circle" />
          </PrimaryButton>
        </li>
      </List>
    </Wrapper>
    <Wrapper>
      Default
      <List>
        <li>
          <PrimaryButton size="s" onClick={action('clicked')}>
            Button
          </PrimaryButton>
          <PrimaryButtonAnchor size="s" href="#">
            Anchor
          </PrimaryButtonAnchor>
          <PrimaryButton size="s" disabled={true}>
            Disabled
          </PrimaryButton>
        </li>
      </List>
      With icon (Left)
      <List>
        <li>
          <PrimaryButton
            size="s"
            prefix={<Icon size={11} name="fa-plus-circle" />}
            onClick={action('clicked')}
          >
            Button
          </PrimaryButton>
          <PrimaryButtonAnchor size="s" prefix={<Icon size={11} name="fa-plus-circle" />} href="#">
            Anchor
          </PrimaryButtonAnchor>
          <PrimaryButton size="s" prefix={<Icon size={11} name="fa-plus-circle" />} disabled={true}>
            Disabled
          </PrimaryButton>
        </li>
      </List>
      With icon (Right)
      <List>
        <li>
          <PrimaryButton
            size="s"
            suffix={<Icon size={11} name="fa-plus-circle" />}
            onClick={action('clicked')}
          >
            Button
          </PrimaryButton>
          <PrimaryButtonAnchor size="s" suffix={<Icon size={11} name="fa-plus-circle" />} href="#">
            Anchor
          </PrimaryButtonAnchor>
          <PrimaryButton size="s" suffix={<Icon size={11} name="fa-plus-circle" />} disabled={true}>
            Disabled
          </PrimaryButton>
        </li>
      </List>
      Only icon
      <List>
        <li>
          <PrimaryButton size="s" onClick={action('clicked')} square>
            <Icon size={14} name="fa-plus-circle" />
          </PrimaryButton>
          <PrimaryButtonAnchor size="s" href="#" square>
            <Icon size={14} name="fa-plus-circle" />
          </PrimaryButtonAnchor>
          <PrimaryButton size="s" disabled={true} square>
            <Icon size={14} name="fa-plus-circle" />
          </PrimaryButton>
        </li>
      </List>
    </Wrapper>
  </>
))

const Wrapper = styled.div`
  padding: 1rem;
`

const List = styled.ul`
  padding: 0;
  list-style: none;
  vertical-align: middle;

  & > li {
    & > *:not(:first-child) {
      margin-left: 1.6rem;
    }
  }
`
