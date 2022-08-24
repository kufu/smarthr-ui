import { Story } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'

import { BlankImage } from './BlankImage'

export default {
  title: 'Image',
  component: BlankImage,
}

export const _BlankImage: Story = () => (
  <List>
    <dt>BlankImage size=s</dt>
    <dd>
      <BlankImage alt="S size" size="s" />
    </dd>
    <dt>BlankImage size=m</dt>
    <dd>
      <BlankImage alt="M size" size="m" />
    </dd>
    <dt>BlankImage size=l</dt>
    <dd>
      <BlankImage alt="L size" size="l" />
    </dd>
  </List>
)
_BlankImage.storyName = 'BlankImage'

const List = styled.dl`
  display: block;
  padding: 24px;
`
