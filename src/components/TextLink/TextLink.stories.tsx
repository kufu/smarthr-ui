import { storiesOf } from '@storybook/react'
import React from 'react'
import styled from 'styled-components'
import { TextLink } from './TextLink'
import { FaFlagIcon } from '../Icon'
import readme from './README.md'

storiesOf('TextLink', module)
  .addParameters({
    readme: {
      sidebar: readme,
    },
  })
  .add('all', () => (
    <Wrapper>
      <li>
        <TextLink href="/" prefix={<FaFlagIcon />}>
          Link to Root.
        </TextLink>
      </li>
      <li>
        <TextLink href="/" target="_blank">
          Link to Root with new Tabs.
        </TextLink>
      </li>
      <li>
        <TextLink onClick={() => alert('click!')}>
          Even if only onClick is set, it is focusable.
        </TextLink>
      </li>
      <li>
        <TextLink>unuse href attribute: can tab focasable.</TextLink>
      </li>
    </Wrapper>
  ))

const Wrapper = styled.ul`
  list-style: none;
  margin: 24px;

  li + li {
    margin-top: 16px;
  }
`
