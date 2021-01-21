import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'
import readme from './README.md'

import { RadioButton } from './RadioButton'

storiesOf('RadioButton', module)
  .addParameters({
    readme: {
      sidebar: readme,
    },
  })
  .add('all', () => {
    const [checkedIndex, setCheckedIndex] = React.useState<number>(1)
    return (
      <List>
        <li>
          <RadioButton
            name="sample"
            checked={checkedIndex === 0}
            onChange={(e) => {
              action('onChange')(e)
              setCheckedIndex(0)
            }}
          />
        </li>
        <li>
          <RadioButton
            name="sample"
            checked={checkedIndex === 1}
            onChange={(e) => {
              action('onChange')(e)
              setCheckedIndex(1)
            }}
          />
        </li>
        <li>
          <RadioButton
            name="sample"
            checked={false}
            disabled={true}
            onChange={action('onChange')}
          />
        </li>
        <li>
          <RadioButton name="sample" checked={true} disabled={true} onChange={action('onChange')} />
        </li>
      </List>
    )
  })

const List = styled.ul`
  padding: 0 24px;

  & > li {
    display: inline-block;
    padding: 16px;

    &:not(:first-child) {
      margin-left: 16px;
    }
  }
`
