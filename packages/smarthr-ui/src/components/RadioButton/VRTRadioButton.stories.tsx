import { StoryFn } from '@storybook/react'
import React, { ChangeEvent, useState } from 'react'
import styled from 'styled-components'

import { Fieldset } from '../Fieldset'
import { InformationPanel } from '../InformationPanel'

import { All } from './RadioButton.stories'

import { RadioButton } from '.'

export default {
  title: 'Forms（フォーム）/RadioButton',
  component: RadioButton,
  parameters: {
    withTheming: true,
  },
}

export const VRTState: StoryFn = () => {
  const [checkedName, setCheckedName] = useState<string | null>(null)
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => setCheckedName(e.currentTarget.name)

  return (
    <WrapperList>
      <VRTInformationPanel title="VRT 用の Story です">
        hover, activeなどの状態で表示されます
      </VRTInformationPanel>
      <li>
        <Fieldset title="hover">
          <InnerList id="list-hover">
            <li>
              <RadioButton name="1" checked={checkedName === '1'} onChange={handleChange} />
            </li>
            <li>
              <RadioButton name="2" checked={true} onChange={handleChange} />
            </li>
            <li>
              <RadioButton
                name="3"
                checked={checkedName === '3'}
                disabled
                onChange={handleChange}
              />
            </li>
            <li>
              <RadioButton name="4" checked={true} disabled onChange={handleChange} />
            </li>
          </InnerList>
        </Fieldset>
      </li>

      <li>
        <Fieldset title="focus">
          <InnerList id="list-focus">
            <li>
              <RadioButton name="5" checked={checkedName === '5'} onChange={handleChange} />
            </li>
            <li>
              <RadioButton name="6" checked={true} onChange={handleChange} />
            </li>
            <li>
              <RadioButton
                name="7"
                checked={checkedName === '7'}
                disabled
                onChange={handleChange}
              />
            </li>
            <li>
              <RadioButton name="8" checked={true} disabled onChange={handleChange} />
            </li>
          </InnerList>
        </Fieldset>
      </li>

      <li>
        <Fieldset title="focus-visible">
          <InnerList id="list-focus-visible">
            <li>
              <RadioButton name="9" checked={checkedName === '9'} onChange={handleChange} />
            </li>
            <li>
              <RadioButton name="10" checked={true} onChange={handleChange} />
            </li>
            <li>
              <RadioButton
                name="11"
                checked={checkedName === '11'}
                disabled
                onChange={handleChange}
              />
            </li>
            <li>
              <RadioButton name="12" checked={true} disabled onChange={handleChange} />
            </li>
          </InnerList>
        </Fieldset>
      </li>

      <li>
        <Fieldset title="active">
          <InnerList id="list-active">
            <li>
              <RadioButton name="13" checked={checkedName === '13'} onChange={handleChange} />
            </li>
            <li>
              <RadioButton name="14" checked={true} onChange={handleChange} />
            </li>
            <li>
              <RadioButton
                name="15"
                checked={checkedName === '15'}
                disabled
                onChange={handleChange}
              />
            </li>
            <li>
              <RadioButton name="16" checked={true} disabled onChange={handleChange} />
            </li>
          </InnerList>
        </Fieldset>
      </li>
    </WrapperList>
  )
}

export const VRTForcedColors: StoryFn = () => (
  <>
    <VRTInformationPanel title="VRT 用の Story です">
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

const VRTInformationPanel = styled(InformationPanel)`
  margin-bottom: 24px;
`
