import { Story } from '@storybook/react'
import React from 'react'
import styled, { css } from 'styled-components'

import { Sidebar } from './Sidebar'

export const SidebarStory: Story = () => {
  return (
    <div style={{ margin: '32px' }}>
      <h1>Sidebar</h1>
      <p>
        メインコンテンツとサイドコンテンツの2つのコンテンツをレイアウトするコンポーネントです。メインコンテンツは親要素の幅に対して可変となり、メインコンテンツが設定した最小幅以上の場合は2カラム、最小幅未満になると段落ちします。
      </p>
      <Sidebar>
        <Side>
          <h2>サイドコンテンツ</h2>
        </Side>
        <Main>
          <h2>メインコンテンツ</h2>
          <p>
            メインコンテンツの幅が可変で、メインコンテンツが<Code>contentsMinWidth</Code>
            未満になると段落ちします。<Code>contentsMinWidth</Code>の幅はデフォルトで50%です。
          </p>
        </Main>
      </Sidebar>

      <hr style={{ margin: '32px' }} />

      <Sidebar right contentsMinWidth="600px" gap={{ row: 1, column: 0 }}>
        <Main>
          <h2>メインコンテンツ</h2>
          <p>
            メインコンテンツの<Code>contentsMinWidth</Code>
            を600pxにしています。600px未満になると段落ちします。
            <Code>box-sizing</Code>
            の値に注意してください。
          </p>
          <p>
            メインコンテンツとサイドコンテンツの間の余白は<Code>gap</Code>プロパティで設定できます。
            <Code>row</Code>と<Code>column</Code>
            で別々の値を設定できるので、横並びのときは余白なし、段落ちしたら余白をとる、ということが可能です。
          </p>
        </Main>
        <Side>
          <h2>サイドコンテンツ</h2>
          <p>
            サイドコンテンツを右に配置するには<Code>right</Code>プロパティを
            <Code>true</Code>
            にします。
          </p>
        </Side>
      </Sidebar>
    </div>
  )
}
SidebarStory.parameters = {
  withTheming: true,
}

const Main = styled.main(({ theme }) => {
  const { color, spacing } = theme

  return css`
    box-sizing: border-box;
    padding: ${spacing.XXS} ${spacing.S};
    border: 3px solid ${color.MAIN};
  `
})

const Side = styled.aside(({ theme }) => {
  const { color, spacing } = theme

  return css`
    width: 300px;
    box-sizing: border-box;
    padding: ${spacing.XXS} ${spacing.S};
    border: 3px solid ${color.BORDER};
    background-color: ${color.BACKGROUND};
  `
})

const Code = styled.code(({ theme }) => {
  const { color, radius, spacing } = theme

  return css`
    display: inline-block;
    padding: 0 ${spacing.X3S};
    border: 1px solid ${color.BORDER};
    border-radius: ${radius.s};
    background-color: ${color.BACKGROUND};
  `
})
