import { Story } from '@storybook/react'
import React from 'react'
import styled, { css } from 'styled-components'

import { Base as shrBase } from '../../Base'
import { Heading } from '../../Heading'
import { SectioningFragment } from '../../SectioningContent'
import { LineUp } from '../LineUp'

import { Stack } from '.'

export default {
  title: 'Layouts（レイアウト）/Stack',
  component: Stack,
  parameters: {
    withTheming: true,
  },
}

export const All: Story = () => (
  <LineUp gap={2}>
    <Content>
      <Stack recursive>
        <Base>
          <P>各要素の間隔は 1rem が標準です。</P>
        </Base>
        <Base>
          <P>gap を使って間隔を変えられます。</P>
        </Base>
        <Base>
          <P>recursive を使うと子孫要素に対して再帰的に影響を与えます。</P>

          <SectioningFragment>
            <Stack gap={0.5} as="section">
              <Heading type="blockTitle">入れ子にすることができます</Heading>
              <InnerBase>
                <P>同じ要素である必要もありません。</P>
              </InnerBase>
            </Stack>
          </SectioningFragment>
        </Base>
      </Stack>
    </Content>
    <SideAreaStack gap="XXS" splitAfter={2}>
      <Base>
        <P>各要素の間隔は 1rem が標準です。</P>
      </Base>
      <Base>
        <P>抽象トークンも渡せます。</P>
      </Base>
      <Base>
        <P>splitAfter を使うと分割することができます。</P>
      </Base>
      <Base>
        <P>この場合、Stack の高さは対峙する要素より高さが必要です。</P>
      </Base>
    </SideAreaStack>
  </LineUp>
)

const SideAreaStack = styled(Stack)`
  flex: 1;
`
const Content = styled.div`
  flex: 3;
  min-height: 30vw;
`
const Base = styled(shrBase)(
  ({ theme: { spacingByChar } }) => css`
    padding: ${spacingByChar(1.5)};
  `,
)
const InnerBase = styled(shrBase)(
  ({ theme: { color, spacingByChar } }) => css`
    background-color: ${color.OVER_BACKGROUND};
    padding: ${spacingByChar(1)};
  `,
)
const P = styled.p`
  margin-top: 0;
  margin-bottom: 0;
`
