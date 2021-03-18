import React from 'react'
import styled, { css } from 'styled-components'
import { Story } from '@storybook/react'

import { useTheme } from '../../../hooks/useTheme'
import { Stack } from '.'
import { Base as shrBase } from '../../Base'
import { Heading } from '../../Heading'

import readme from './README.md'

export default {
  title: 'Stack',
  component: Stack,
  parameters: {
    docs: {
      description: { component: readme },
    },
  },
}

export const Default: Story = () => (
  <LineUp>
    <Content>
      <Stack recursive>
        <Base>
          <P>各要素の間隔は 1rem が標準です。</P>
        </Base>
        <Base>
          <P>spaceLength を使って間隔を変えられます。</P>
        </Base>
        <Base>
          <P>recursive を使うと子孫要素に対して再帰的に影響を与えます。</P>

          <Stack spaceLength={0.5}>
            <Heading type="blockTitle">入れ子にすることができます</Heading>
            <InnerBase>
              <P>同じ要素である必要もありません。</P>
            </InnerBase>
          </Stack>
        </Base>
      </Stack>
    </Content>
    <SideAreaStack splitAfter={2}>
      <Base>
        <P>各要素の間隔は 1rem が標準です</P>
      </Base>
      <Base>
        <P>各要素の間隔は 1rem が標準です</P>
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

const LineUp = styled.div(() => {
  const { space } = useTheme()

  return css`
    display: flex;

    > * + * {
      margin-left: ${space(2)};
    }
  `
})
const SideAreaStack = styled(Stack)`
  flex: 1;
`
const Content = styled.div`
  flex: 3;
  min-height: 30vw;
`
const Base = styled(shrBase)(() => {
  const { space } = useTheme()
  return css`
    padding: ${space(1.5)};
  `
})
const InnerBase = styled(shrBase)(() => {
  const { color, space } = useTheme()
  return css`
    background-color: ${color.OVER_BACKGROUND};
    padding: ${space(1)};
  `
})
const P = styled.p`
  margin-top: 0;
  margin-bottom: 0;
`
