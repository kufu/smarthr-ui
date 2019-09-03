import { storiesOf } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'

import { BlankImage } from './BlankImage'

storiesOf('Image', module).add('BlankImage', () => (
  <List>
    <dt>BlankImage size="s"</dt>
    <dd>
      <BlankImage title="S size" size="s" />
    </dd>
    <dt>BlankImage size="m"</dt>
    <dd>
      <BlankImage title="M size" size="m" />
    </dd>
    <dt>BlankImage size="l"</dt>
    <dd>
      <BlankImage title="L size" size="l" />
    </dd>
  </List>
))

const List = styled.dl`
  display: block;
  padding: 24px;
`
