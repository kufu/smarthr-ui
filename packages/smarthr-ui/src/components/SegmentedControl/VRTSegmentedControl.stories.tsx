import { action } from '@storybook/addon-actions'
import { StoryFn } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'

import { InformationPanel } from '../InformationPanel'

import { All } from './SegmentedControl.stories'

import { SegmentedControl, SegmentedControlOption } from '.'

export default {
  title: 'Buttons（ボタン）/SegmentedControl',
  component: SegmentedControl,
  parameters: {
    withTheming: true,
  },
}

const departmentAndCrewOptions: SegmentedControlOption[] = [
  { value: 'departments', content: '部署' },
  { value: 'crews', content: '従業員' },
  { value: 'both', content: '部署と従業員' },
]

export const VRTState: StoryFn = () => {
  const [value1, setValue1] = React.useState<string | null>('departments')

  return (
    <Wrapper>
      <VRTInformationPanel title="VRT 用の Story です">
        hover, activeなどの状態で表示されます
      </VRTInformationPanel>
      <List>
        <dt id="dt-hover">hover</dt>
        <dd id="dd-hover">
          <SegmentedControl
            options={departmentAndCrewOptions}
            value={value1}
            onClickOption={(value) => {
              action('clicked')(value)
              setValue1(value)
            }}
            aria-labelledby="dt-hover"
          />
        </dd>

        <dt id="dt-focus">focus</dt>
        <dd id="dd-focus">
          <SegmentedControl
            options={departmentAndCrewOptions}
            value={value1}
            onClickOption={(value) => {
              action('clicked')(value)
              setValue1(value)
            }}
            aria-labelledby="dt-focus"
          />
        </dd>

        <dt id="dt-focus-visible">focus-visible</dt>
        <dd id="dd-focus-visible">
          <SegmentedControl
            options={departmentAndCrewOptions}
            value={value1}
            onClickOption={(value) => {
              action('clicked')(value)
              setValue1(value)
            }}
            aria-labelledby="dt-focus-visible"
          />
        </dd>

        <dt id="dt-active">active</dt>
        <dd id="dd-active">
          <SegmentedControl
            options={departmentAndCrewOptions}
            value={value1}
            onClickOption={(value) => {
              action('clicked')(value)
              setValue1(value)
            }}
            aria-labelledby="dt-active"
          />
        </dd>
      </List>
    </Wrapper>
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
    hover: ['#dd-hover button'],
    focus: ['#dd-focus button'],
    focusVisible: ['#dd-focus-visible button'],
    active: ['#dd-active button'],
  },
}
VRTForcedColors.parameters = {
  chromatic: { forcedColors: 'active' },
}

const List = styled.dl`
  padding: 1rem;
  margin: 0;

  dt {
    margin-bottom: 0.5rem;
  }
  dd {
    margin-left: 0;
    margin-bottom: 1rem;
  }
`

const Wrapper = styled.div`
  height: 100vh;
  box-sizing: border-box;
  padding: 24px;
  color: ${({ theme }) => theme.color.TEXT_BLACK};
`

const VRTInformationPanel = styled(InformationPanel)`
  margin-bottom: 24px;
`
