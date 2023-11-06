import { Story } from '@storybook/react'
import React from 'react'

import { Base } from '../Base'
import { Button } from '../Button'
import { FormGroup } from '../FormGroup'
import { Input } from '../Input'
import { Stack } from '../Layout'
import { Text } from '../Text'
import { TextLink } from '../TextLink'

import { Footer } from './Footer'
import { MessageScreen } from './MessageScreen'

export default {
  title: 'Page Templates（ページテンプレート）/MessageScreen',
  component: MessageScreen,
  parameters: {
    layout: 'fullscreen',
  },
}

export const Full: Story = () => (
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
    <p>
      いつも SmartHR をご利用いただきありがとうございます。
      <br />
      ただいまメンテナンスのため、一時サービスを停止しております。
      <br />
      ご迷惑をおかけいたしますが、ご理解のほどよろしくお願いいたします。
    </p>
  </MessageScreen>
)
Full.storyName = 'full'

export const WithoutTitle: Story = () => (
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
    <Base padding={1.5}>
      <Stack gap={1.5}>
        <Stack>
          <FormGroup title="メールアドレス" titleType="subBlockTitle" innerMargin="XXS">
            <Input name="email" width="22em" />
          </FormGroup>
          <FormGroup title="パスワード" titleType="subBlockTitle" innerMargin="XXS">
            <Input name="password" width="22em" />
          </FormGroup>
        </Stack>
        <Stack align="center">
          <Button variant="primary" wide>
            ログイン
          </Button>
          <TextLink href="http://example.com">パスワードをお忘れの方</TextLink>
        </Stack>
      </Stack>
    </Base>
  </MessageScreen>
)
WithoutTitle.storyName = 'without title'

export const WithoutLinks: Story = () => (
  <MessageScreen
    title={
      <Stack as="span" align="center" gap={0.5}>
        <span>株式会社 TEST INC</span>
        <Text size="L">専用ログイン画面</Text>
      </Stack>
    }
  >
    <Base padding={1.5}>
      <Stack gap={1.5}>
        <Stack>
          <FormGroup title="社員番号またはメールアドレス">
            <Input name="email" width="22em" />
          </FormGroup>
          <FormGroup title="パスワード">
            <Input name="password" width="22em" />
          </FormGroup>
        </Stack>
        <Stack align="center">
          <Button variant="primary" wide>
            ログイン
          </Button>
          <TextLink href="http://example.com">パスワードをお忘れの方</TextLink>
        </Stack>
      </Stack>
    </Base>
  </MessageScreen>
)
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

export const WithFooter: Story = () => (
  <MessageScreen links={[{ label: 'ホームへ', url: 'http://example.com' }]} footer={<Footer />} />
)
WithFooter.storyName = 'with footer'
