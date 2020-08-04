import { storiesOf } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'

import { Loader } from './Loader'
import readme from './README.md'

storiesOf('Loader', module)
  .addParameters({
    readme: {
      sidebar: readme,
    },
  })
  .add('all', () => (
    <>
      <GrayWrapper>
        <Text>You can choose the size.</Text>
        <Inner>
          <Loader size="s" />
          <Loader size="m" />
          <Loader size="l" />
        </Inner>
      </GrayWrapper>

      <Wrapper>
        <Text>You can choose the color.</Text>
        <Inner>
          <Loader color="#00a5ab" />
          <Loader color="#007bc2" />
          <Loader color="#ff8800" />
          <Loader color="#ef475b" />
        </Inner>
      </Wrapper>
    </>
  ))

const Wrapper = styled.div`
  padding: 24px;
`
const GrayWrapper = styled(Wrapper)`
  background-color: #c1c1c1;
`
const Inner = styled.div`
  display: flex;
  align-items: center;

  & > *:not(:first-child) {
    margin-left: 24px;
  }
`
const Text = styled.p`
  margin: 0 0 16px 0;
  font-size: 18px;
`
