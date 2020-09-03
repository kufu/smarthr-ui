import React, { useState } from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import styled from 'styled-components'
import { BackgroundJobsPanel, JobProps } from './BackgroundJobsPanel'
import { BackgroundJobsList } from './BackgroundJobsList'

storiesOf('BackgroundJobs', module)
  .add('panel', () => {
    return (
      <List>
        <dt>Normal</dt>
        <dd>
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
              {
                id: 2,
                status: 'downloading',
                name: 'Job 2',
                description: 'Downloading',
              },
              {
                id: 3,
                status: 'warning',
                name: 'Job 3',
                description: 'Warning',
              },
              {
                id: 4,
                status: 'error',
                name: 'Job 4',
                description: 'Error',
              },
              {
                id: 5,
                status: 'done',
                name: 'Job 5',
                description: 'Done',
              },
            ]}
            onClickExpansion={action('click expansion')}
            onClickCancelJob={action('click cancel')}
            onClickClose={action('click close')}
            isExpanded
          />
        </dd>
        <dt>Closed</dt>
        <dd>
          <BackgroundJobsPanel
            title="Closed panel"
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
            onClickClose={action('click close')}
            isExpanded={false}
          />
        </dd>
        <dt>Toggle expansion</dt>
        <dd>
          <BackgroundJobsPanel
            title="can toggle by maximize/minimize button"
            jobs={[
              {
                id: 1,
                status: 'processing',
                name: 'Job 1',
                description: 'Processing',
                isCancelable: true,
              },
              {
                id: 2,
                status: 'downloading',
                name: 'Job 2',
                description: 'Downloading',
              },
              {
                id: 3,
                status: 'warning',
                name: 'Job 3',
                description: 'Warning',
              },
              {
                id: 4,
                status: 'error',
                name: 'Job 4',
                description: 'Error',
              },
              {
                id: 5,
                status: 'done',
                name: 'Job 5',
                description: 'Done',
              },
            ]}
            onClickExpansion={action('click expansion')}
            onClickCancelJob={action('click cancel')}
            onClickClose={action('click close')}
          />
        </dd>
        <dt>Long text ellipsis</dt>
        <dd>
          <BackgroundJobsPanel
            title="Ellipsis"
            jobs={[
              {
                id: 1,
                status: 'downloading',
                name: 'long long long long long long long long long long long long name',
                description:
                  'long long long long long long long long long long long long description',
              },
              {
                id: 2,
                status: 'downloading',
                name: 'long long long long long long long long long long long long name',
                description:
                  'long long long long long long long long long long long long description',
                isCancelable: true,
              },
            ]}
            onClickExpansion={action('click expansion')}
            onClickCancelJob={action('click cancel')}
            onClickClose={action('click close')}
          />
        </dd>
      </List>
    )
  })
  .add('list', () => {
    const [panels, setPanels] = useState<
      Array<{
        seq: number
        jobs: JobProps[]
      }>
    >([])
    const [panelSeq, setPanelSeq] = useState(1)
    return (
      <Wrapper>
        <button
          onClick={() => {
            setPanels(
              panels.concat({
                seq: panelSeq,
                jobs: [
                  {
                    id: 1,
                    status: 'processing',
                    name: 'Job 1',
                    description: 'Processing',
                    isCancelable: true,
                  },
                  {
                    id: 2,
                    status: 'downloading',
                    name: 'Job 2',
                    description: 'Downloading',
                  },
                ],
              }),
            )
            setPanelSeq(panelSeq + 1)
          }}
        >
          Add panel
        </button>
        <BackgroundJobsList>
          {panels.map(({ seq, jobs }) => (
            <BackgroundJobsList.Item key={seq}>
              <BackgroundJobsPanel
                title={`Jobs panel ${seq}`}
                jobs={jobs}
                onClickClose={() => {
                  setPanels(panels.filter((panel) => panel.seq !== seq))
                }}
              />
            </BackgroundJobsList.Item>
          ))}
        </BackgroundJobsList>
      </Wrapper>
    )
  })

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
const Wrapper = styled.div`
  padding: 2rem;
`
