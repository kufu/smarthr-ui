import * as React from 'react'
import { Story } from '@storybook/react'
import styled, { css } from 'styled-components'
import { Theme, useTheme } from '../../hooks/useTheme'

import { Base } from '../Base'
import { FieldSet } from '../FieldSet'
import { MessageScreen } from './MessageScreen'
import { Button } from '../Button'
import { TextLink } from '../TextLink'

import readme from './README.md'

export default {
  title: 'MessageScreen',
  component: MessageScreen,
  parameters: {
    readme: {
      sidebar: readme,
    },
  },
}

export const Full: Story = () => {
  const themes = useTheme()
  return (
    <MessageScreen
      title="SmartHR は現在メンテナンス中です"
      links={[
        {
          label: 'SmartHR お知らせ',
          url: 'http://example.com',
          target: '_blank',
        },
      ]}
    >
      <Description themes={themes}>
        いつも SmartHR をご利用いただきありがとうございます。
        <br />
        ただいまメンテナンスのため、一時サービスを停止しております。
        <br />
        ご迷惑をおかけいたしますが、ご理解のほどよろしくお願いいたします。
      </Description>
    </MessageScreen>
  )
}
Full.storyName = 'full'

export const WithoutTitle: Story = () => {
  return (
    <MessageScreen
      links={[
        {
          label: '新しく企業アカウントを作成する',
          url: 'http://example.com',
        },
        {
          label: '登録確認メールを再送する',
          url: 'http://example.com',
        },
      ]}
    >
      <BoxWrapper>
        <Box>
          <List>
            <li>
              <FieldSet label="メールアドレス" width="100%" />
            </li>
            <li>
              <FieldSet label="パスワード" width="100%" />
            </li>
          </List>
          <Bottom>
            <Button variant="primary" wide>
              ログイン
            </Button>
            <TextLink href="http://example.com">パスワードをお忘れの方</TextLink>
          </Bottom>
        </Box>
      </BoxWrapper>
    </MessageScreen>
  )
}
WithoutTitle.storyName = 'without title'

export const WithoutLinks: Story = () => {
  const themes = useTheme()
  return (
    <MessageScreen
      title={
        <>
          株式会社 TEST INC
          <br />
          <Headline themes={themes}>専用ログイン画面</Headline>
        </>
      }
    >
      <Box>
        <List>
          <li>
            <FieldSet label="社員番号またはメールアドレス" width="100%" />
          </li>
          <li>
            <FieldSet label="パスワード" width="100%" />
          </li>
        </List>
        <Bottom>
          <Button variant="primary" wide>
            ログイン
          </Button>
          <TextLink href="http://example.com">パスワードをお忘れの方</TextLink>
        </Bottom>
      </Box>
    </MessageScreen>
  )
}
WithoutLinks.storyName = 'without links'

export const WithoutChildren: Story = () => (
  <MessageScreen
    title="サンプルタイトル"
    links={[
      {
        label: 'ホームへ',
        url: 'http://example.com',
      },
    ]}
  />
)
WithoutChildren.storyName = 'without children'

export const WithoutAllOptionalProps: Story = () => <MessageScreen />
WithoutAllOptionalProps.storyName = 'without all optional props'

const Description = styled.div<{ themes: Theme }>`
  ${({ themes }) => css`
    color: ${themes.color.TEXT_BLACK};
    font-size: ${themes.fontSize.M};
    line-height: 21px;
    text-align: center;
  `}
`
const BoxWrapper = styled.div`
  margin-bottom: 16px;
`
const Box = styled(Base)`
  width: 400px;
  padding: 24px;
  box-sizing: border-box;
`
const List = styled.ul`
  margin: 0 0 24px;
  padding: 0;
  list-style: none;

  > li:first-child {
    margin-bottom: 16px;
  }
`
const Bottom = styled.div`
  width: 180px;
  margin: 0 auto;
  text-align: center;

  > *:first-child {
    margin-bottom: 24px;
  }
`
const Headline = styled.span<{ themes: Theme }>`
  ${({ themes }) => css`
    display: inline-block;
    width: 100%;
    margin-top: 16px;
    color: ${themes.color.TEXT_BLACK};
    font-size: ${themes.fontSize.L};
    text-align: center;
  `}
`
