import { StoryFn } from '@storybook/react'
import { userEvent, within } from '@storybook/test'
import React, { useState } from 'react'
import styled from 'styled-components'

import { FormControl } from '../FormControl'
import { Stack } from '../Layout'

import { Textarea } from './Textarea'

export default {
  title: 'Forms（フォーム）/Textarea',
  component: Textarea,
}

const Template: StoryFn = () => {
  const [value1, setValue1] = useState('message👌')
  const [value2, setValue2] = useState('message👌')
  const [value3, setValue3] = useState('message👌')
  return (
    <ListStack>
      <li>
        <FormControl title="標準">
          <Textarea name="default" />
        </FormControl>
      </li>
      <li>
        <FormControl title="入力欄を自動で広げる（初期： 3行、最大： 10行）">
          <Textarea name="auto_resize" cols={35} rows={3} maxRows={10} autoResize />
        </FormControl>
      </li>
      <li>
        <FormControl title="幅指定">
          <Textarea name="width" width="100%" />
        </FormControl>
      </li>
      <li>
        <FormControl title="disabled">
          <Textarea name="disabled" disabled={true} />
        </FormControl>
      </li>
      <li>
        <FormControl title="エラー時">
          <Textarea name="error" error={true} />
        </FormControl>
      </li>
      <li>
        <FormControl title="最大文字数 (defaultValue)">
          <Textarea
            name="max_length_with_default_value"
            maxLetters={140}
            defaultValue="message👌"
          />
        </FormControl>
      </li>
      <li>
        <FormControl title="最大文字数 (value)">
          <Textarea
            name="max_length_with_value"
            maxLetters={140}
            value={value1}
            onChange={(e) => setValue1(e.target.value)}
          />
        </FormControl>
      </li>
      <li>
        <FormControl title="最大文字数 (value)">
          <Textarea
            name="max_length_with_value_over"
            maxLetters={4}
            value={value2}
            onChange={(e) => setValue2(e.target.value)}
          />
        </FormControl>
      </li>
      <li>
        <FormControl title="最大文字数 (decorators)">
          <Textarea
            name="max_length_with_value_and_decorators"
            maxLetters={140}
            value={value3}
            onChange={(e) => setValue3(e.target.value)}
            decorators={{
              beforeMaxLettersCount: (txt) => `entry limit(${txt})`,
              afterMaxLettersCount: (txt) => ` characters(${txt})`,
            }}
          />
        </FormControl>
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
