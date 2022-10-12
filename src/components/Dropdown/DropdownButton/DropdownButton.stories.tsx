import React from 'react'
import { Story } from '@storybook/react'

import { DropdownButton } from './DropdownButton'
import { AnchorButton, Button } from '../../Button'
import { Cluster } from '../../Layout'

const flag = false

export const Default: Story = () => (
  <Cluster align="center">
    <DropdownButton>
      <Button>評価を開始</Button>
      <Button disabled>評価を確定</Button>
      <Button>ヒントメッセージの設定</Button>
      <AnchorButton href="#h2-2">ログアウト</AnchorButton>
      {flag && <Button>非表示になるテキスト</Button>}
    </DropdownButton>
    <DropdownButton disabled>
      <Button>評価を開始</Button>
      <Button disabled>評価を確定</Button>
      <Button>ヒントメッセージの設定</Button>
      <AnchorButton href="#h2-2">ログアウト</AnchorButton>
    </DropdownButton>
    <DropdownButton onlyIconTrigger>
      <Button>評価を開始</Button>
      <Button disabled>評価を確定</Button>
      <Button>ヒントメッセージの設定</Button>
      <AnchorButton href="#h2-2">ログアウト</AnchorButton>
    </DropdownButton>
    <DropdownButton triggerSize="s" label="操作">
      <Button>評価を開始</Button>
      <Button disabled>評価を確定</Button>
      <Button>ヒントメッセージの設定</Button>
      <AnchorButton href="#h2-2">ログアウト</AnchorButton>
    </DropdownButton>
    <DropdownButton
      triggerSize="s"
      label="操作"
      labelDecorator={(text) => <span style={{ color: 'red' }}>{text}</span>}
    >
      <Button>評価を開始</Button>
      <Button disabled>評価を確定</Button>
      <Button>ヒントメッセージの設定</Button>
      <AnchorButton href="#h2-2">ログアウト</AnchorButton>
    </DropdownButton>
    <DropdownButton
      triggerSize="s"
      label="操作"
      labelDecorator={(text) => <span style={{ color: 'red' }}>{text}</span>}
    >
      <Button>評価を開始</Button>
      <Button disabled>評価を確定</Button>
      <Button>ヒントメッセージの設定</Button>
      <AnchorButton href="#h2-2">ログアウト</AnchorButton>
    </DropdownButton>
    <DropdownButton triggerSize="s" onlyIconTrigger>
      <Button>評価を開始</Button>
      <Button disabled>評価を確定</Button>
      <Button>ヒントメッセージの設定</Button>
      <AnchorButton href="#h2-2">ログアウト</AnchorButton>
    </DropdownButton>
  </Cluster>
)
Default.storyName = 'DropdownButton'
