import React from 'react'
import { storiesOf } from '@storybook/react'
import styled from 'styled-components'

import { IndexNav } from './IndexNav'
import { IndexNavItem } from './IndexNavItem'
import { IndexNavList } from './IndexNavList'

import readme from './README.md'

storiesOf('IndexNav', module)
  .addParameters({
    readme: {
      sidebar: readme,
    },
  })
  .add('all', () => (
    <List>
      <dt>First layer current</dt>
      <dd>
        <IndexNav
          items={[
            { label: 'first layer index 1', href: 'https://example.com/1' },
            { label: 'first layer index 2', href: 'https://example.com/2', current: true },
            {
              label: 'first layer index 3',
              href: 'https://example.com/3',
              children: [
                { label: 'second layer index 1', href: 'https://example.com/3_1' },
                { label: 'second layer index 2', href: 'https://example.com/3_2' },
                { label: 'second layer index 3', href: 'https://example.com/3_3' },
              ],
            },
            { label: 'first layer index 4', href: 'https://example.com/4' },
          ]}
        />
      </dd>
      <dt>Second layer current</dt>
      <dd>
        <IndexNav
          items={[
            { label: 'first layer index 1', href: 'https://example.com/1' },
            { label: 'first layer index 2', href: 'https://example.com/2' },
            {
              label: 'first layer index 3',
              href: 'https://example.com/3',
              children: [
                { label: 'second layer index 1', href: 'https://example.com/3_1' },
                { label: 'second layer index 2', href: 'https://example.com/3_2' },
                { label: 'second layer index 3', href: 'https://example.com/3_3', current: true },
              ],
            },
            { label: 'first layer index 4', href: 'https://example.com/4' },
          ]}
        />
      </dd>
    </List>
  ))
  .add('alternative', () => (
    <List>
      <dt>First layer current</dt>
      <dd>
        <IndexNavList>
          <IndexNavItem label="first layer index 1" href="https://expamle.com/1" />
          <IndexNavItem label="first layer index 2" href="https://expamle.com/2" current />
          <IndexNavItem label="first layer index 3" href="https://expamle.com/3">
            <IndexNavItem label="second layer index 1" href="https://expamle.com/5" />
            <IndexNavItem label="second layer index 2" href="https://expamle.com/6" />
            <IndexNavItem label="second layer index 3" href="https://expamle.com/7" />
          </IndexNavItem>
          <IndexNavItem label="first layer index 4" href="https://expamle.com/4" />
        </IndexNavList>
      </dd>
      <dt>Second layer current</dt>
      <dd>
        <IndexNavList>
          <IndexNavItem label="first layer index 1" href="https://expamle.com/1" />
          <IndexNavItem label="first layer index 2" href="https://expamle.com/2" />
          <IndexNavItem label="first layer index 3" href="https://expamle.com/3">
            <IndexNavItem label="second layer index 1" href="https://expamle.com/5" />
            <IndexNavItem label="second layer index 2" href="https://expamle.com/6" />
            <IndexNavItem label="second layer index 3" href="https://expamle.com/7" current />
          </IndexNavItem>
          <IndexNavItem label="first layer index 4" href="https://expamle.com/4" />
        </IndexNavList>
      </dd>
    </List>
  ))

const List = styled.dl`
  margin: 1rem;

  & > dd {
    margin: 10px 10px 40px;
  }
`
