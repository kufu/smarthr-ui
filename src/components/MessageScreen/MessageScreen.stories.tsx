import * as React from 'react'
import { storiesOf } from '@storybook/react'
import styled, { css } from 'styled-components'
import { Theme, useTheme } from '../../hooks/useTheme'

import { Base } from '../Base'
import { FieldSet } from '../FieldSet'
import { MessageScreen } from './MessageScreen'
import { PrimaryButton } from '../Button'
import { TextLink } from '../TextLink'

import readme from './README.md'

storiesOf('MessageScreen', module)
  .addParameters({
    readme: {
      sidebar: readme,
    },
  })
  .add('full', () => {
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
  })
  .add('without title', () => {
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
              <PrimaryButton wide>ログイン</PrimaryButton>
              <TextLink href="http://example.com">パスワードをお忘れの方</TextLink>
            </Bottom>
          </Box>
        </BoxWrapper>
      </MessageScreen>
    )
  })
  .add('without links', () => {
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
            <PrimaryButton wide>ログイン</PrimaryButton>
            <TextLink href="http://example.com">パスワードをお忘れの方</TextLink>
          </Bottom>
        </Box>
      </MessageScreen>
    )
  })
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
