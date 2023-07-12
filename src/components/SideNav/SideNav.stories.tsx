import { action } from '@storybook/addon-actions'
import { Story } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'

import { Heading } from '../Heading'
import { StatusLabel } from '../StatusLabel'

import { SideNav } from './SideNav'

export default {
  title: 'Navigation（ナビゲーション）/SideNav',
  component: SideNav,
}

const Label = styled(StatusLabel)`
  /* &.grey {
    background-color: #fff;
  } */
`

const SideNavItems = [
  {
    id: 'id-1',
    title: ' one!',
    isSelected: true,
  },
  {
    id: 'id-2',
    title: 'two!',
    isSelected: false,
  },
  {
    id: 'id-3',
    title: 'three!',
    isSelected: false,
  },
  {
    id: 'id-4',
    title: 'four!',
    isSelected: false,
  },
  {
    id: 'id-5',
    title: 'five!',
    isSelected: false,
  },
]

const SideNavPrefixItems = [
  {
    id: 'id-1',
    title: 'todo 1',
    isSelected: true,
    prefix: <Label>done</Label>,
  },
  {
    id: 'id-2',
    title: 'todo 2',
    isSelected: false,
    prefix: (
      <Label type="blue" bold>
        must
      </Label>
    ),
  },
  {
    id: 'id-3',
    title: 'todo 3',
    isSelected: false,
    prefix: (
      <Label type="blue" bold>
        must
      </Label>
    ),
  },
  {
    id: 'id-4',
    title: 'todo 4',
    isSelected: false,
    prefix: (
      <Label type="blue" bold>
        must
      </Label>
    ),
  },
  {
    id: 'id-5',
    title: 'todo 5',
    isSelected: false,
    prefix: (
      <Label type="blue" bold>
        must
      </Label>
    ),
  },
]

export const All: Story = () => (
  <Wrapper>
    <StyledHeading type="sectionTitle">default</StyledHeading>
    <SideNav items={SideNavItems} onClick={action('clicked')} />

    <StyledHeading type="sectionTitle">Small Size</StyledHeading>
    <SideNav size="s" items={SideNavItems} onClick={action('clicked')} />

    <StyledHeading type="sectionTitle">With Prefix</StyledHeading>
    <SideNav items={SideNavPrefixItems} onClick={action('clicked')} />
  </Wrapper>
)
All.storyName = 'all'

const Wrapper = styled.div`
  padding: 24px;
  width: 200px;
`

const StyledHeading = styled(Heading)`
  margin: 0 0 16px;
`
