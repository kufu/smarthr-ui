import { Story } from '@storybook/react'
import React, { ComponentProps } from 'react'

import { AnchorButton, Button } from '../../Button'
import { RemoteDialogTrigger, RemoteTriggerActionDialog } from '../../Dialog'
import { Cluster } from '../../Layout'

import { DropdownMenuButton } from './DropdownMenuButton'

const nullText: string = ''

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
    {nullText}
    {false}
    {undefined}
    {null}
    {[].length && <Button>非表示になるテキスト</Button>}
    <RemoteDialogTrigger targetId="hoge">
      <Button>Triggerのテスト</Button>
    </RemoteDialogTrigger>
  </DropdownMenuButton>
)

export const Default: Story = () => (
  <Cluster align="center" justify="flex-end">
    <Template label="その他の操作" />
    <Template disabled label="その他の操作" />
    <Template onlyIconTrigger label="その他の操作" />
    <Template triggerSize="s" label="操作" />
    <Template triggerSize="s" label={<span>操作</span>} disabled />
    <Template triggerSize="s" onlyIconTrigger label="操作" />
    <RemoteTriggerActionDialog
      id="hoge"
      title="Triggerのテスト"
      actionText="保存"
      onClickAction={(close) => {
        close()
      }}
    >
      Remote Trigger Action Dialog.
    </RemoteTriggerActionDialog>
  </Cluster>
)
Default.storyName = 'DropdownMenuButton'
