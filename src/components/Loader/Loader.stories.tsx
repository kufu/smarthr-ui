import { Story } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'

import { Loader } from './Loader'
import readme from './README.md'

export default {
  title: 'Loader',
  component: Loader,
  parameters: {
    readme: {
      sidebar: readme,
    },
  },
}

export const All: Story = () => {
  return (
    <>
      <Wrapper>
        <Text>Primary</Text>
        <List>
          <dt>Default</dt>
          <dd>
            <Loader />
          </dd>
          <dt>Small</dt>
          <dd>
            <Loader size="s" />
          </dd>
          <dt>With text</dt>
          <dd>
            <Loader text="loading message" />
          </dd>
        </List>
      </Wrapper>

      <GrayWrapper>
        <Text>Light</Text>
        <List>
          <dt>Default</dt>
          <dd>
            <Loader type="light" />
          </dd>
          <dt>Small</dt>
          <dd>
            <Loader type="light" size="s" />
          </dd>
          <dt>With text</dt>
          <dd>
            <Loader type="light" text="loading message" />
          </dd>
        </List>
      </GrayWrapper>
    </>
  )
}
All.storyName = 'all'

const Wrapper = styled.div`
  padding: 24px;
`
const GrayWrapper = styled(Wrapper)`
  background-color: rgba(0, 0, 0, 0.5);

  p,
  dt {
    color: #fff;
  }
`
const Text = styled.p`
  margin: 0 0 16px;
`
const List = styled.dl`
  margin: 1rem;
  & > dd {
    margin: 16px 0 40px;
  }
`
