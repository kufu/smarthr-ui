import React from 'react'
import { Story } from '@storybook/react'

import { DropdownButtons } from './DropdownButtons'
import { AnchorButton, Button } from '../../Button'
import { Cluster } from '../../Layout'

export default {
  title: 'DropdownButtons',
  component: DropdownButtons,
}

export const Default: Story = () => (
  <Cluster align="center">
    <DropdownButtons>
      <Button>評価を開始</Button>
      <Button disabled>評価を確定</Button>
      <Button>ヒントメッセージの設定</Button>
      <AnchorButton href="#h2-2">ログアウト</AnchorButton>
    </DropdownButtons>
    <DropdownButtons disabled>
      <Button>評価を開始</Button>
      <Button disabled>評価を確定</Button>
      <Button>ヒントメッセージの設定</Button>
      <AnchorButton href="#h2-2">ログアウト</AnchorButton>
    </DropdownButtons>
    <DropdownButtons onlyIconTrigger>
      <Button>評価を開始</Button>
      <Button disabled>評価を確定</Button>
      <Button>ヒントメッセージの設定</Button>
      <AnchorButton href="#h2-2">ログアウト</AnchorButton>
    </DropdownButtons>
    <DropdownButtons triggerSize="s" label="操作">
      <Button>評価を開始</Button>
      <Button disabled>評価を確定</Button>
      <Button>ヒントメッセージの設定</Button>
      <AnchorButton href="#h2-2">ログアウト</AnchorButton>
    </DropdownButtons>
    <DropdownButtons triggerSize="s" onlyIconTrigger>
      <Button>評価を開始</Button>
      <Button disabled>評価を確定</Button>
      <Button>ヒントメッセージの設定</Button>
      <AnchorButton href="#h2-2">ログアウト</AnchorButton>
    </DropdownButtons>
  </Cluster>
)
