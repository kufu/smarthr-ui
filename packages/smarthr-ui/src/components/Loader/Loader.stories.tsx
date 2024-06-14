import { StoryFn } from '@storybook/react'
import * as React from 'react'
import { ComponentProps } from 'react'
import styled, { css } from 'styled-components'

import { Loader } from './Loader'

export default {
  title: 'States（状態）/Loader',
  component: Loader,
}

// NOTE: 本来はアニメーションの表示を遅延させているが、Chromaticでのスナップショットテストが失敗するため、その影響を受けないように設定。
const CustomLoader = (props: ComponentProps<typeof Loader>) => (
  <Loader {...props} className="shr-opacity-100 shr-animate-none" />
)

export const All: StoryFn = () => (
  <>
    <Wrapper>
      <Text>Primary</Text>
      <List>
        <dt>Default</dt>
        <dd>
          <CustomLoader />
        </dd>
        <dt>Small</dt>
        <dd>
          <CustomLoader size="s" />
        </dd>
        <dt>With text</dt>
        <dd>
          <CustomLoader text="loading message" />
        </dd>
      </List>
    </Wrapper>

    <GrayWrapper>
      <Text>Light</Text>
      <List>
        <dt>Default</dt>
        <dd>
          <CustomLoader type="light" />
        </dd>
        <dt>Small</dt>
        <dd>
          <CustomLoader type="light" size="s" />
        </dd>
        <dt>With text</dt>
        <dd>
          <CustomLoader type="light" text="loading message" />
        </dd>
      </List>
    </GrayWrapper>
  </>
)
All.storyName = 'all'
All.parameters = { withTheming: true }

const Wrapper = styled.div`
  padding: 24px;
`
const GrayWrapper = styled(Wrapper)(
  ({ theme: { color } }) => css`
    background-color: ${color.SCRIM};

    p,
    dt {
      color: #fff;
    }
  `,
)

const Text = styled.p`
  margin: 0 0 16px;
`
const List = styled.dl`
  margin: 1rem;
  & > dd {
    margin: 16px 0 40px;
  }
`
