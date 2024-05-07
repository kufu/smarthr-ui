import { StoryFn } from '@storybook/react'
import React, { ChangeEvent, useState } from 'react'
import styled from 'styled-components'

import { InformationPanel } from '../InformationPanel'

import { All } from './CheckBox.stories'

import { CheckBox } from '.'

export default {
  title: 'Forms（フォーム）/CheckBox',
  component: CheckBox,
  parameters: {
    withTheming: true,
  },
}

export const VRTState: StoryFn = () => {
  const [checkedName, setCheckedName] = useState<string[]>([])
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const currentName = e.currentTarget.name

    if (checkedName.includes(currentName)) {
      setCheckedName(checkedName.filter((name) => name !== currentName))
    } else {
      setCheckedName([...checkedName, currentName])
    }
  }

  return (
    <WrapperList>
      <VRTInformationPanel title="VRT 用の Story です" togglable={false}>
        hover, activeなどの状態で表示されます
      </VRTInformationPanel>
      <li>
        <Title>hover</Title>
        <InnerList id="list-hover">
          <li>
            <CheckBox name="2" checked={checkedName.includes('2')} onChange={handleChange} />
          </li>
          <li>
            <CheckBox name="2" checked={true} onChange={handleChange} />
          </li>
          <li>
            <CheckBox name="error" error onChange={handleChange} />
          </li>
          <li>
            <CheckBox name="error" checked={true} error onChange={handleChange} />
          </li>
          <li>
            <CheckBox name="2" checked={true} mixed onChange={handleChange} />
          </li>
          <li>
            <CheckBox name="disabled" disabled onChange={handleChange} />
          </li>
          <li>
            <CheckBox name="checked_disabled" checked disabled onChange={handleChange} />
          </li>
        </InnerList>
      </li>

      <li>
        <Title>focus</Title>
        <InnerList id="list-focus">
          <li>
            <CheckBox name="2" checked={checkedName.includes('2')} onChange={handleChange} />
          </li>
          <li>
            <CheckBox name="2" checked={true} onChange={handleChange} />
          </li>
          <li>
            <CheckBox name="error" error onChange={handleChange} />
          </li>
          <li>
            <CheckBox name="error" checked={true} error onChange={handleChange} />
          </li>
          <li>
            <CheckBox name="2" checked={true} mixed onChange={handleChange} />
          </li>
          <li>
            <CheckBox name="disabled" disabled onChange={handleChange} />
          </li>
          <li>
            <CheckBox name="checked_disabled" checked disabled onChange={handleChange} />
          </li>
        </InnerList>
      </li>

      <li>
        <Title>focus-visible</Title>
        <InnerList id="list-focus-visible">
          <li>
            <CheckBox name="2" checked={checkedName.includes('2')} onChange={handleChange} />
          </li>
          <li>
            <CheckBox name="2" checked={true} onChange={handleChange} />
          </li>
          <li>
            <CheckBox name="error" error onChange={handleChange} />
          </li>
          <li>
            <CheckBox name="error" checked={true} error onChange={handleChange} />
          </li>
          <li>
            <CheckBox name="2" checked={true} mixed onChange={handleChange} />
          </li>
          <li>
            <CheckBox name="disabled" disabled onChange={handleChange} />
          </li>
          <li>
            <CheckBox name="checked_disabled" checked disabled onChange={handleChange} />
          </li>
        </InnerList>
      </li>

      <li>
        <Title>active</Title>
        <InnerList id="list-active">
          <li>
            <CheckBox name="2" checked={checkedName.includes('2')} onChange={handleChange} />
          </li>
          <li>
            <CheckBox name="2" checked={true} onChange={handleChange} />
          </li>
          <li>
            <CheckBox name="error" error onChange={handleChange} />
          </li>
          <li>
            <CheckBox name="error" checked={true} error onChange={handleChange} />
          </li>
          <li>
            <CheckBox name="2" checked={true} mixed onChange={handleChange} />
          </li>
          <li>
            <CheckBox name="disabled" disabled onChange={handleChange} />
          </li>
          <li>
            <CheckBox name="checked_disabled" checked disabled onChange={handleChange} />
          </li>
        </InnerList>
      </li>
    </WrapperList>
  )
}

export const VRTForcedColors: StoryFn = () => (
  <>
    <VRTInformationPanel title="VRT 用の Story です" togglable={false}>
      Chromatic 上では強制カラーモードで表示されます
    </VRTInformationPanel>
    <All />
  </>
)

VRTState.parameters = {
  controls: { hideNoControlsWarning: true },
  pseudo: {
    hover: ['#list-hover input'],
    focus: ['#list-focus input'],
    focusVisible: ['#list-focus-visible input'],
    active: ['#list-active input'],
  },
}
VRTForcedColors.parameters = {
  chromatic: { forcedColors: 'active' },
}

const WrapperList = styled.ul`
  padding: 0 24px;
  list-style: none;
  & > li {
    padding: 16px;
    &:not(:first-child) {
      margin-top: 8px;
    }
  }
`
const InnerList = styled.ul`
  padding: 0;
  list-style: none;
  & > li {
    display: inline-block;
    &:not(:first-child) {
      margin-left: 16px;
    }
  }
`
const Title = styled.p`
  margin: 0 0 16px;
`

const VRTInformationPanel = styled(InformationPanel)`
  margin-bottom: 24px;
`
