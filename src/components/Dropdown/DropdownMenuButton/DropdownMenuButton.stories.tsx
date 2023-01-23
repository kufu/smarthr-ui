import { Story } from '@storybook/react'
import React, { ComponentProps } from 'react'

import { AnchorButton, Button } from '../../Button'
import { Cluster } from '../../Layout'

import { DropdownMenuButton } from './DropdownMenuButton'

const flag = false

const Template: React.FC<Omit<ComponentProps<typeof DropdownMenuButton>, 'children'>> = (props) => (
  <DropdownMenuButton {...props}>
    <Button>評価を開始</Button>
    <Button
      disabled
      disabledDetail={{
        message: '評価を開始していないため、評価を確定できません。',
      }}
    >
      評価を確定
    </Button>
    <Button>ヒントメッセージの設定</Button>
    <AnchorButton href="#h2-2">ログアウト</AnchorButton>
    {flag && <Button>非表示になるテキスト</Button>}
  </DropdownMenuButton>
)

export const Default: Story = () => (
  <Cluster align="center">
    <Template label="デフォルト" />
    <Template disabled label="無効化" />
    <Template onlyIconTrigger label="アイコンのみ" />
    <Template triggerSize="s" label="操作" />
    <Template triggerSize="s" label={<span>操作</span>} disabled />
    <Template triggerSize="s" onlyIconTrigger label="操作" />
  </Cluster>
)
Default.storyName = 'DropdownMenuButton'
