import { action } from '@storybook/addon-actions'
import { StoryFn } from '@storybook/react'
import { userEvent, within } from '@storybook/testing-library'
import * as React from 'react'
import styled from 'styled-components'

import { InformationPanel } from '../InformationPanel'

import { BackgroundJobsList } from './BackgroundJobsList'
import { BackgroundJobsPanel } from './BackgroundJobsPanel'
import { PanelView } from './BackgroundJobsPanel.stories'

export default {
  title: 'Data Display（データ表示）/BackgroundJobsPanel',
  component: BackgroundJobsPanel,
  subcomponents: {
    BackgroundJobsList,
  },
  parameters: {
    withTheming: true,
  },
}

export const VRTPanelState: StoryFn = () => (
  <>
    <VRTInformationPanel title="VRT 用の Story です" togglable={false}>
      hover, activeなどの状態で表示されます
    </VRTInformationPanel>
    <List>
      <dt>hover</dt>
      <dd id="hover">
        <BackgroundJobsPanel
          title="Jobs panel"
          jobs={[
            {
              id: 1,
              status: 'processing',
              name: 'Job 1',
              description: 'Processing',
              isCancelable: true,
            },
          ]}
          onClickExpansion={action('click expansion')}
          onClickCancelJob={action('click cancel')}
          onClickClose={action('click close')}
          isExpanded
        />
      </dd>
      <dt>focus</dt>
      <dd id="focus">
        <BackgroundJobsPanel
          title="Jobs panel"
          jobs={[
            {
              id: 1,
              status: 'processing',
              name: 'Job 1',
              description: 'Processing',
              isCancelable: true,
            },
          ]}
          onClickExpansion={action('click expansion')}
          onClickCancelJob={action('click cancel')}
          onClickClose={action('click close')}
          isExpanded
        />
      </dd>
      <dt>focusVisible</dt>
      <dd id="focus-visible">
        <BackgroundJobsPanel
          title="Jobs panel"
          jobs={[
            {
              id: 1,
              status: 'processing',
              name: 'Job 1',
              description: 'Processing',
              isCancelable: true,
            },
          ]}
          onClickExpansion={action('click expansion')}
          onClickCancelJob={action('click cancel')}
          onClickClose={action('click close')}
          isExpanded
        />
      </dd>
      <dt>active</dt>
      <dd id="active">
        <BackgroundJobsPanel
          title="Jobs panel"
          jobs={[
            {
              id: 1,
              status: 'processing',
              name: 'Job 1',
              description: 'Processing',
              isCancelable: true,
            },
          ]}
          onClickExpansion={action('click expansion')}
          onClickCancelJob={action('click cancel')}
          onClickClose={action('click close')}
          isExpanded
        />
      </dd>
    </List>
  </>
)
VRTPanelState.parameters = {
  controls: { hideNoControlsWarning: true },
  pseudo: {
    hover: ['#hover button'],
    focus: ['#focus button'],
    focusVisible: ['#focus-visible button'],
    active: ['#active button'],
  },
}

export const VRTPanelHoverLong: StoryFn = () => (
  <List>
    <dt>Hover long text ellipsis</dt>
    <dd>
      <BackgroundJobsPanel
        title="Ellipsis"
        jobs={[
          {
            id: 1,
            status: 'downloading',
            name: 'long long long long long long long long long long long long name',
            description: 'long long long long long long long long long long long long description',
          },
        ]}
        onClickExpansion={action('click expansion')}
        onClickCancelJob={action('click cancel')}
        onClickClose={action('click close')}
      />
    </dd>
  </List>
)
VRTPanelHoverLong.play = async ({ canvasElement }: { canvasElement: HTMLElement }) => {
  const canvas = within(canvasElement)
  const text = await canvas.findByText(
    'long long long long long long long long long long long long name',
    { selector: 'span' },
  )
  await userEvent.hover(text)
}

export const VRTPanelForcedColors: StoryFn = () => (
  <>
    <VRTInformationPanel title="VRT 用の Story です" togglable={false}>
      Chromatic 上では強制カラーモードで表示されます
    </VRTInformationPanel>
    <PanelView />
  </>
)
VRTPanelForcedColors.parameters = {
  chromatic: { forcedColors: 'active' },
}

const VRTInformationPanel = styled(InformationPanel)`
  margin-bottom: 24px;
`
const List = styled.dl`
  list-style: none;
  margin: 0;
  padding: 2rem;

  dt {
    margin-bottom: 1rem;
  }
  dd {
    margin: 0 0 2rem;
  }
`
