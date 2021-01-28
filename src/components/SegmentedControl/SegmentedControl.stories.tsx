import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import * as React from 'react'
import styled from 'styled-components'

import { SegmentedControl } from './SegmentedControl'
import { FaPlusCircleIcon } from '../Icon'

import readme from './README.md'

storiesOf('SegmentedControl', module)
  .addParameters({
    readme: {
      sidebar: readme,
    },
  })
  .add('all', () => {
    const [value1, setValue1] = React.useState<string | null>('segment1')
    const [value2, setValue2] = React.useState<string | null>('segment5')
    const [value3, setValue3] = React.useState<string | null>('segment3')
    const [value4, setValue4] = React.useState<string | null>(null)
    const [value5, setValue5] = React.useState<string | null>(null)

    const options = [
      { value: 'segment1', ariaLabel: 'segment1' },
      { value: 'segment2', ariaLabel: 'segment2' },
      { value: 'segment3', ariaLabel: 'segment3' },
      { value: 'segment4', ariaLabel: 'segment4' },
      { value: 'segment5', ariaLabel: 'segment5' },
    ]
    return (
      <List>
        <dt id="dt-default">Default</dt>
        <dd>
          <SegmentedControl
            options={options.map((option) => ({ ...option, content: 'Button' }))}
            value={value1}
            onClickOption={(value) => {
              action('clicked')(value)
              setValue1(value)
            }}
            aria-labelledby="dt-default"
          />
        </dd>
        <dt id="dt-small">Small</dt>
        <dd>
          <SegmentedControl
            options={options.map((option) => ({ ...option, content: 'Button' }))}
            value={value2}
            onClickOption={(value) => {
              action('clicked')(value)
              setValue2(value)
            }}
            size="s"
            aria-labelledby="dt-small"
          />
        </dd>
        <dt id="dt-icon">Icon</dt>
        <dd>
          <SegmentedControl
            options={options.map((option) => ({
              ...option,
              content: <FaPlusCircleIcon size={16} />,
            }))}
            value={value3}
            onClickOption={(value) => {
              action('clicked')(value)
              setValue3(value)
            }}
            isSquare
            aria-labelledby="dt-icon"
          />
        </dd>
        <dt id="dt-small-icon">Small icon</dt>
        <dd>
          <SegmentedControl
            options={options.map((option) => ({
              ...option,
              content: <FaPlusCircleIcon size={13} />,
            }))}
            value={value4}
            onClickOption={(value) => {
              action('clicked')(value)
              setValue4(value)
            }}
            size="s"
            isSquare
            aria-labelledby="dt-small-icon"
          />
        </dd>
        <dt id="dt-disabled">Disabled</dt>
        <dd>
          <SegmentedControl
            options={options.map((option, i) => ({
              ...option,
              content: 'Button',
              disabled: i > 2,
            }))}
            value={value5}
            onClickOption={(value) => {
              action('clicked')(value)
              setValue5(value)
            }}
            aria-labelledby="dt-disabled"
          />
        </dd>
      </List>
    )
  })

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
