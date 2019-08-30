import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import * as React from 'react'
// import styled from 'styled-components'
import { Tab } from './Tab'
import { TabBar } from './TabBar'

storiesOf('TabBar', module).add('all', () => (
  <>
    <TabBar>
      <Tab label="tab" id="1" onClick={action('clicked')} />
      <Tab label="Actived tab" id="2" onClick={action('clicked')} active />
      <Tab label="Disabled tab" id="3" onClick={action('clicked')} disabled />
    </TabBar>
  </>
))
