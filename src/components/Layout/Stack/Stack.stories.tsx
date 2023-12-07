import { StoryFn } from '@storybook/react'
import React from 'react'
import styled from 'styled-components'

import { Base, BaseColumn } from '../../Base'
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

export const All: StoryFn = () => (
  <LineUp gap={2}>
    <Content>
      <Stack>
        <Base padding={1.5}>
          <p>各要素の間隔は 1rem が標準です。</p>
        </Base>
        <Base padding={1.5}>
          <p>gap を使って間隔を変えられます。</p>
        </Base>
        <Base padding={1.5}>
          <Stack>
            <p>Stack で囲んだ直下の子孫要素に対してのい、影響を与えます。</p>

            <SectioningFragment>
              <Stack gap={0.5} as="section">
                <Heading type="blockTitle">入れ子にして別の値を指定できます。</Heading>
                <BaseColumn>
                  <p>同じ要素である必要もありません。</p>
                </BaseColumn>
              </Stack>
            </SectioningFragment>
          </Stack>
        </Base>
      </Stack>
    </Content>
    <SideAreaStack gap="XXS" className="[&_>_*:nth-child(2)]:shr-mb-auto">
      <Base padding={1.5}>
        <p>各要素の間隔は 1rem が標準です。</p>
      </Base>
      <Base padding={1.5}>
        <p>抽象トークンも渡せます。</p>
      </Base>
      <Base padding={1.5}>
        <p>
          要素を離して表示したい場合は、<code>[&_&gt;_*:nth-child(2)]:shr-mb-auto</code>
          と書きます。
        </p>
      </Base>
      <Base padding={1.5}>
        <p>この場合、Stack の高さは対峙する要素より高さが必要です。</p>
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
