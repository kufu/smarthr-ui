import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import * as React from 'react'
// import styled from 'styled-components'
import { Tab } from './Tab'

storiesOf('TabBar', module).add('all', () => (
  <>
    <Tab label="tab" id="1" onClick={action('clicked')}></Tab>
    <Tab label="tab" id="2" onClick={action('clicked')} active></Tab>
    <Tab label="tab" id="3" onClick={action('clicked')} disabled></Tab>
  </>
))
