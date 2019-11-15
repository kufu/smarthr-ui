import { action } from './node_modules/@storybook/addon-actions'
import { storiesOf } from './node_modules/@storybook/react'
import * as React from './node_modules/react'
import styled from './node_modules/styled-components'

import { CheckBox } from './CheckBox'
import readme from './README.md'

const onChange = action('onChange')

storiesOf('CheckBox', module)
  .addParameters({
    readme: {
      sidebar: readme,
    },
  })
  .add('all', () => (
    <Group>
      <li>
        <Text>checked</Text>
        <List>
          <li>
            <CheckBox name="sample" checked={true} onChange={onChange} />
          </li>
          <li>
            <CheckBox name="sample" checked={true} disabled={true} onChange={onChange} />
          </li>
          <li className="dark">
            <CheckBox name="sample" checked={true} onChange={onChange} themeColor="dark" />
          </li>
        </List>
      </li>

      <li>
        <Text>unchecked</Text>
        <List>
          <li>
            <CheckBox name="sample" checked={false} onChange={onChange} />
          </li>
          <li>
            <CheckBox name="sample" checked={false} disabled={true} onChange={onChange} />
          </li>
          <li className="dark">
            <CheckBox name="sample" checked={false} onChange={onChange} themeColor="dark" />
          </li>
        </List>
      </li>

      <li>
        <Text>mixed</Text>
        <List>
          <li>
            <CheckBox name="sample" checked={true} mixed={true} onChange={onChange} />
          </li>
          <li>
            <CheckBox
              name="sample"
              checked={true}
              mixed={true}
              disabled={true}
              onChange={onChange}
            />
          </li>
          <li className="dark">
            <CheckBox
              name="sample"
              checked={true}
              mixed={true}
              onChange={onChange}
              themeColor="dark"
            />
          </li>
        </List>
      </li>
    </Group>
  ))

const List = styled.ul`
  padding: 0;
  & > li {
    display: inline-block;
    padding: 16px;
    &:not(:first-child) {
      margin-left: 16px;
    }
    &.dark {
      background-color: gray;
    }
  }
`
const Group = styled.ul`
  list-style: none;
  & > li:not(:first-child) {
    margin-top: 24px;
  }
`
const Text = styled.p`
  margin: 0 0 16px 0;
  font-size: 16px;
`
