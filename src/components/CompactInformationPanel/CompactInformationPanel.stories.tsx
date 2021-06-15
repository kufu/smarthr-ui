import React from 'react'
import { Story } from '@storybook/react'
import styled from 'styled-components'

import { CompactInformationPanel } from '.'

import readme from './README.md'

export default {
  title: 'CompactInformationPanel',
  component: CompactInformationPanel,
  parameters: {
    docs: {
      description: { component: readme },
    },
  },
}

export const Default: Story = () => (
  <CompactInformationPanel>
    <Message>
      CompactInformationPanel
      は画面内の操作を進めるにあたってユーザーに伝えるべきメッセージを表示する領域です。
      <br />
      InformationPanel とは異なり、パネルを閉じることはできません。
    </Message>
  </CompactInformationPanel>
)
export const Type: Story = () => (
  <Wrapper>
    <CompactInformationPanel type="info">
      <Message>これは [type=info] の CompactInformationPanel です。</Message>
      <Message>type を省略した場合も [type=info] になります。</Message>
    </CompactInformationPanel>
    <CompactInformationPanel type="success">
      <Message>これは [type=success] の CompactInformationPanel です。</Message>
    </CompactInformationPanel>
    <CompactInformationPanel type="warning">
      <Message>これは [type=warning] の CompactInformationPanel です。</Message>
    </CompactInformationPanel>
    <CompactInformationPanel type="error">
      <Message>これは [type=error] の CompactInformationPanel です。</Message>
    </CompactInformationPanel>
  </Wrapper>
)

const Wrapper = styled.div`
  > * + * {
    margin-top: 1rem;
  }
`
const Message = styled.p`
  margin-top: 0;
  margin-bottom: 0;
`
