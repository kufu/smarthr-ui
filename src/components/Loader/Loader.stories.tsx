import { storiesOf } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'

import { Loader } from './Loader'

storiesOf('Loader', module).add('all', () => (
  <>
    <GrayWrapper>
      <Loader size="s" />
      <Loader size="m" />
      <Loader size="l" />
    </GrayWrapper>
    <WhiteWrapper>
      <Loader color="#00a5ab" />
      <Loader color="#007bc2" />
      <Loader color="#ff8800" />
      <Loader color="#ef475b" />
    </WhiteWrapper>
  </>
))

const WhiteWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 24px;

  & > *:not(:first-child) {
    margin-left: 24px;
  }
`
const GrayWrapper = styled(WhiteWrapper)`
  background-color: #c1c1c1;
`
