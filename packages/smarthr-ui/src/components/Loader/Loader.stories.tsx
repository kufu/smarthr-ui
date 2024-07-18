import { StoryFn } from '@storybook/react'
import React from 'react'
import styled, { css } from 'styled-components'

import { Loader } from './Loader'

export default {
  title: 'States（状態）/Loader',
  component: Loader,
}

export const All: StoryFn = () => {
  // NOTE: 本来は表示を遅延させているが、VRT 向けにデフォルトでは表示を遅延させない。
  const [deferDisplay, setDeferDisplay] = React.useState(false)
  return (
    <>
      <label>
        <input
          type="checkbox"
          name="defer_display"
          checked={deferDisplay}
          onChange={() => setDeferDisplay(!deferDisplay)}
        />
        defer display
      </label>
      <Wrapper>
        <Text>Primary</Text>
        <List>
          <dt>Default</dt>
          <dd>
            <Loader deferDisplay={deferDisplay} />
          </dd>
          <dt>Small</dt>
          <dd>
            <Loader deferDisplay={deferDisplay} size="s" />
          </dd>
          <dt>With text</dt>
          <dd>
            <Loader deferDisplay={deferDisplay} text="loading message" />
          </dd>
        </List>
      </Wrapper>

      <GrayWrapper>
        <Text>Light</Text>
        <List>
          <dt>Default</dt>
          <dd>
            <Loader deferDisplay={deferDisplay} type="light" />
          </dd>
          <dt>Small</dt>
          <dd>
            <Loader deferDisplay={deferDisplay} type="light" size="s" />
          </dd>
          <dt>With text</dt>
          <dd>
            <Loader deferDisplay={deferDisplay} type="light" text="loading message" />
          </dd>
        </List>
      </GrayWrapper>
    </>
  )
}
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
