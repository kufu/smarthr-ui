import React, { ComponentProps } from 'react'
import { Story } from '@storybook/react'

import { DropdownButton } from './DropdownButton'
import { AnchorButton, Button } from '../../Button'
import { Cluster } from '../../Layout'

const flag = false

const Template: React.FC<Omit<ComponentProps<typeof DropdownButton>, 'children'>> = (props) => (
  <DropdownButton {...props}>
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
  </DropdownButton>
)

export const Default: Story = () => (
  <Cluster align="center">
    <Template />
    <Template disabled />
    <Template onlyIconTrigger />
    <Template triggerSize="s" label="操作" />
    <Template triggerSize="s" label={<span>操作</span>} disabled />
    <Template triggerSize="s" onlyIconTrigger />
  </Cluster>
)
Default.storyName = 'DropdownButton'
