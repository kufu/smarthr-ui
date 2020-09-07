import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import * as React from 'react'
import styled from 'styled-components'

import { SegmentedControl } from './SegmentedControl'
import { Icon } from '../Icon'

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
      { value: 'segment2', ariaLabel: 'segment1' },
      { value: 'segment3', ariaLabel: 'segment1' },
      { value: 'segment4', ariaLabel: 'segment1' },
      { value: 'segment5', ariaLabel: 'segment1' },
    ]
    return (
      <List>
        <dt>Default</dt>
        <dd>
          <SegmentedControl
            options={options.map((option) => ({ ...option, content: 'Button' }))}
            value={value1}
            onClickOption={(value) => {
              action('clicked')(value)
              setValue1(value)
            }}
          />
        </dd>
        <dt>Small</dt>
        <dd>
          <SegmentedControl
            options={options.map((option) => ({ ...option, content: 'Button' }))}
            value={value2}
            onClickOption={(value) => {
              action('clicked')(value)
              setValue2(value)
            }}
            size="s"
          />
        </dd>
        <dt>Icon</dt>
        <dd>
          <SegmentedControl
            options={options.map((option) => ({
              ...option,
              content: <Icon size={16} name="fa-plus-circle" />,
            }))}
            value={value3}
            onClickOption={(value) => {
              action('clicked')(value)
              setValue3(value)
            }}
            isSquare
          />
        </dd>
        <dt>Small icon</dt>
        <dd>
          <SegmentedControl
            options={options.map((option) => ({
              ...option,
              content: <Icon size={13} name="fa-plus-circle" />,
            }))}
            value={value4}
            onClickOption={(value) => {
              action('clicked')(value)
              setValue4(value)
            }}
            size="s"
            isSquare
          />
        </dd>
        <dt>Disabled</dt>
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
