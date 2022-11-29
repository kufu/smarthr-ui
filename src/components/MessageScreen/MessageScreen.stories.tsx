import { Story } from '@storybook/react'
import * as React from 'react'
import styled, { css } from 'styled-components'

import { Base } from '../Base'
import { Button } from '../Button'
import { FormGroup } from '../FormGroup'
import { Input } from '../Input'
import { TextLink } from '../TextLink'

import { MessageScreen } from './MessageScreen'

export default {
  title: 'MessageScreen',
  component: MessageScreen,
  parameters: {
    withTheming: true,
  },
}

export const Full: Story = () => {
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
      <Description>
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
              <FormGroup
                title="メールアドレス"
                titleType="subBlockTitle"
                innerMargin="XXS"
                htmlFor="id-email"
              >
                <Input id="id-email" width="100%" />
              </FormGroup>
            </li>
            <li>
              <FormGroup
                title="パスワード"
                titleType="subBlockTitle"
                innerMargin="XXS"
                htmlFor="id-password"
              >
                <Input id="id-password" width="100%" />
              </FormGroup>
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
  return (
    <MessageScreen
      title={
        <>
          株式会社 TEST INC
          <br />
          <Headline>専用ログイン画面</Headline>
        </>
      }
    >
      <Box>
        <List>
          <li>
            <FormGroup
              title="社員番号またはメールアドレス"
              titleType="subBlockTitle"
              innerMargin="XXS"
              htmlFor="id-email"
            >
              <Input id="id-email" width="100%" />
            </FormGroup>
          </li>
          <li>
            <FormGroup
              title="パスワード"
              titleType="subBlockTitle"
              innerMargin="XXS"
              htmlFor="id-password"
            >
              <Input id="id-password" width="100%" />
            </FormGroup>
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

const Description = styled.div(
  ({ theme }) => css`
    color: ${theme.color.TEXT_BLACK};
    font-size: ${theme.fontSize.M};
    line-height: 21px;
    text-align: center;
  `,
)

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
const Headline = styled.span(
  ({ theme }) => css`
    display: inline-block;
    width: 100%;
    margin-top: 16px;
    color: ${theme.color.TEXT_BLACK};
    font-size: ${theme.fontSize.L};
    text-align: center;
  `,
)
