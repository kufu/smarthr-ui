import { Story } from '@storybook/react'
import React, { useState } from 'react'
import styled from 'styled-components'

import { Textarea } from './Textarea'

import readme from './README.md'
import { Stack } from '../Layout'

export default {
  title: 'Textarea',
  component: Textarea,
  parameters: {
    readme: {
      sidebar: readme,
    },
  },
}

export const All: Story = () => {
  const [value, setValue] = useState('message👌')
  const onChangeValue = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setValue(e.currentTarget.value)
  return (
    <List>
      <li>
        <Label>
          標準
          <Textarea />
        </Label>
      </li>
      <li>
        <Label>
          入力欄を自動で広げる（初期： 3行、最大： 10行）
          <Textarea cols={35} rows={3} maxRows={10} autoGrowable />
        </Label>
      </li>
      <li>
        <Label>
          幅指定
          <Textarea width="100%" />
        </Label>
      </li>
      <li>
        <Label>
          disabled
          <Textarea disabled={true} />
        </Label>
      </li>
      <li>
        <Label>
          エラー時
          <Textarea error={true} />
        </Label>
      </li>
      <li>
        <Label>
          最大文字数 (defaultValue)
          <Textarea maxLength={140} defaultValue="message👌" />
        </Label>
      </li>
      <li>
        <Label>
          最大文字数 (value)
          <Textarea maxLength={140} value={value} onChange={onChangeValue} />
        </Label>
      </li>
    </List>
  )
}

All.storyName = 'all'

const List = styled(Stack).attrs({ as: 'ul', gap: 1.5 })`
  padding: 0 24px;
  list-style: none;
`
const Label = styled(Stack).attrs({ as: 'label', gap: 0.25, align: 'flex-start' })``
