import * as React from 'react'
import styled from 'styled-components'
import { storiesOf } from '@storybook/react'

import { Base } from '../Base'
import { FieldSet } from '../FieldSet'
import { MessageScreen } from './MessageScreen'
import { PrimaryButton } from '../Button'

import readme from './README.md'

storiesOf('MessageScreen', module)
  .addParameters({
    readme: {
      sidebar: readme,
    },
  })
  .add('full', () => (
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
  ))
  .add('without title', () => (
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
            <PrimaryButton wide>ログイン</PrimaryButton>
            <Link href="http://example.com">パスワードをお忘れの方</Link>
          </Bottom>
        </Box>
      </BoxWrapper>
    </MessageScreen>
  ))
  .add('without links', () => (
    <MessageScreen title="株式会社 TEST INC">
      <Headline>専用ログイン画面</Headline>
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
          <PrimaryButton wide>ログイン</PrimaryButton>
          <Link href="http://example.com">パスワードをお忘れの方</Link>
        </Bottom>
      </Box>
    </MessageScreen>
  ))
  .add('without children', () => (
    <MessageScreen
      title="サンプルタイトル"
      links={[
        {
          label: 'ホームへ',
          url: 'http://example.com',
        },
      ]}
    />
  ))
  .add('without all optional props', () => <MessageScreen />)

const Description = styled.div`
  color: #333;
  font-size: 14px;
  line-height: 21px;
  text-align: center;
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
  margin: 0 0 24px 0;
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
const Link = styled.a`
  color: #007bc2;
  font-size: 14px;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`
const Headline = styled.p`
  margin: 0 0 32px 0;
  color: #333;
  font-size: 18px;
  text-align: center;
`
