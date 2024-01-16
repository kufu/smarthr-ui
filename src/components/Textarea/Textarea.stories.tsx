import { StoryFn } from '@storybook/react'
import { userEvent, within } from '@storybook/testing-library'
import React, { useState } from 'react'
import styled from 'styled-components'

import { Stack } from '../Layout'

import { Textarea } from './Textarea'

export default {
  title: 'Forms（フォーム）/Textarea',
  component: Textarea,
}

const Template: StoryFn = () => {
  const [value, setValue] = useState('message👌')
  const onChangeValue = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setValue(e.currentTarget.value)
  return (
    <ListStack>
      <li>
        <LabelStack>
          標準
          <Textarea name="default" />
        </LabelStack>
      </li>
      <li>
        <LabelStack>
          入力欄を自動で広げる（初期： 3行、最大： 10行）
          <Textarea name="auto_resize" cols={35} rows={3} maxRows={10} autoResize />
        </LabelStack>
      </li>
      <li>
        <LabelStack>
          幅指定
          <Textarea name="width" width="100%" />
        </LabelStack>
      </li>
      <li>
        <LabelStack>
          disabled
          <Textarea name="disabled" disabled={true} />
        </LabelStack>
      </li>
      <li>
        <LabelStack>
          エラー時
          <Textarea name="error" error={true} />
        </LabelStack>
      </li>
      <li>
        <LabelStack>
          最大文字数 (defaultValue)
          <Textarea name="max_length_with_default_value" maxLength={140} defaultValue="message👌" />
        </LabelStack>
      </li>
      <li>
        <LabelStack>
          最大文字数 (value)
          <Textarea
            name="max_length_with_value"
            maxLength={140}
            value={value}
            onChange={onChangeValue}
          />
        </LabelStack>
      </li>
      <li>
        <LabelStack>
          最大文字数 (value)
          <Textarea
            name="max_length_with_value_over"
            maxLength={4}
            value={value}
            onChange={onChangeValue}
          />
        </LabelStack>
      </li>
      <li>
        <LabelStack>
          最大文字数 (decorators)
          <Textarea
            name="max_length_with_value_and_decorators"
            maxLength={140}
            value={value}
            onChange={onChangeValue}
            decorators={{
              beforeMaxLengthCount: (txt) => `entry limit(${txt})`,
              afterMaxLengthCount: (txt) => ` characters(${txt})`,
            }}
          />
        </LabelStack>
      </li>
    </ListStack>
  )
}

export const All = Template.bind({})

export const RegInput = Template.bind({})
RegInput.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  const notResizableTextarea = await canvas.findByLabelText('標準')
  // デフォルトでは入力欄が広がらないことを確認する
  await userEvent.type(notResizableTextarea, 'hoge\n'.repeat(3), { delay: 0.1 })

  const resizableTextarea = await canvas.findByLabelText(
    '入力欄を自動で広げる（初期： 3行、最大： 10行）',
  )
  // 11行入力し、入力欄が10行以上広がらないことを確認する
  await userEvent.type(resizableTextarea, 'hoge\n'.repeat(11), { delay: 0.1 })
}

const ListStack = styled(Stack).attrs({ forwardedAs: 'ul', gap: 1.5 })`
  padding: 0 24px;
  list-style: none;
`
const LabelStack = styled(Stack).attrs({ forwardedAs: 'label', gap: 0.25, align: 'flex-start' })``
