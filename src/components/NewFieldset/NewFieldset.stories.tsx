import { Story } from '@storybook/react'
import * as React from 'react'
import styled, { css } from 'styled-components'

import { useTheme } from '../../hooks/useTheme'

import { NewFieldset } from './NewFieldset'

import { RadioButton } from '../RadioButton'
import { CheckBox } from '../CheckBox'
import { Stack } from '../Layout'

// import readme from './README.md'

export default {
  title: 'NewFieldset',
  component: NewFieldset,
}

export const All: Story = () => {
  const theme = useTheme()

  return (
    <Stack>
      <NewFieldset legend="選択肢">
        <RadioButton name="choices" defaultChecked key="radio" value="radio">
          単一選択
        </RadioButton>
        <RadioButton name="choices" key="checkbox" value="checkbox">
          複数選択
        </RadioButton>
        <RadioButton name="choices" key="norder" value="norder">
          N段階
        </RadioButton>
        <RadioButton name="choices" key="textbox" value="textbox">
          自由記述
        </RadioButton>
      </NewFieldset>
      <NewFieldset legend="選択肢 背景なし" background="none">
        <RadioButton name="choices" defaultChecked key="radio" value="radio">
          単一選択
        </RadioButton>
        <RadioButton name="choices" key="checkbox" value="checkbox">
          複数選択
        </RadioButton>
        <RadioButton name="choices" key="norder" value="norder">
          N段階
        </RadioButton>
        <RadioButton name="choices" key="textbox" value="textbox">
          自由記述
        </RadioButton>
      </NewFieldset>
      <NewFieldset legend="チェックボックス">
        <CheckBox key={1} defaultChecked>
          単一選択
        </CheckBox>
        <CheckBox key={2}>複数選択</CheckBox>
        <CheckBox key={3}>N段階</CheckBox>
        <CheckBox key={4}>自由記述</CheckBox>
      </NewFieldset>
      <NewFieldset legend="disabled チェックボックス" disabled>
        <CheckBox key={1} defaultChecked>
          単一選択
        </CheckBox>
        <CheckBox key={2} disabled={false}>
          複数選択
        </CheckBox>
        <CheckBox key={3}>N段階</CheckBox>
        <CheckBox key={4}>自由記述</CheckBox>
      </NewFieldset>
    </Stack>
  )
}
All.storyName = 'all'
