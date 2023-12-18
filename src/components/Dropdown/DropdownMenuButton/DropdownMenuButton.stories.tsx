import { Meta, StoryObj } from '@storybook/react'
import React, { ComponentProps } from 'react'

import { AnchorButton, Button } from '../../Button'
import { RemoteDialogTrigger, RemoteTriggerActionDialog } from '../../Dialog'
import { Cluster } from '../../Layout'

import { DropdownMenuButton } from './DropdownMenuButton'

const meta = {
  title: 'Buttons（ボタン）/Dropdown',
  component: DropdownMenuButton,
  excludeStories: ['Render'],
} satisfies Meta<typeof DropdownMenuButton>
export default meta

type Story = StoryObj<typeof meta>

const emptyAry: any[] = []
const falsyText: string = ''
const falsyAry: any[] | undefined = undefined
const falsyFunction: (() => void) | undefined = undefined
const falsyObj: { [key: string]: any } | undefined = undefined

const truthyText: string = 'ok'
const truthyAry: any[] | undefined = ['ok']
const truthyFunction: (() => void) | undefined = () => undefined
const truthyObj: { [key: string]: any } | undefined = {}

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
    {null}
    {undefined}
    {false}
    {emptyAry.length && <Button>非表示になるボタン</Button>}
    {falsyText && <Button>非表示になるボタン</Button>}
    {falsyAry && <Button>非表示になるボタン</Button>}
    {falsyFunction && <Button>非表示になるボタン</Button>}
    {falsyObj && <Button>非表示になるボタン</Button>}
    {truthyAry.length && <Button>表示になるボタン(length)</Button>}
    {truthyText && <Button>表示になるボタン(text)</Button>}
    {emptyAry && <Button>表示になるボタン(array)</Button>}
    {
      // @ts-ignore
      truthyFunction && <Button>表示になるボタン(function)</Button>
    }
    {truthyObj && <Button>表示になるボタン(object)</Button>}
    <RemoteDialogTrigger targetId="hoge">
      <Button>Triggerのテスト</Button>
    </RemoteDialogTrigger>
    <RemoteDialogTrigger targetId="hoge">
      <Button disabled={true}>Triggerのテスト</Button>
    </RemoteDialogTrigger>
  </DropdownMenuButton>
)

export const Render: React.FC = () => (
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

export const DropdownMenuStory: Story = {
  name: 'DropdownMenuButton',
  args: {
    label: '',
    children: null,
  },
  render: () => <Render />,
}
