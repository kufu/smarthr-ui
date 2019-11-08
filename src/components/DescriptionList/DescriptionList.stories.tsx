import { storiesOf } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'
import { Heading } from '../Heading'
import { Base } from '../Base'
import { DescriptionList } from './DescriptionList'

const DescriptionListItems = [
  {
    label: 'label 1',
    children: 'content 1',
  },
  {
    label: 'label 2',
    children: 'content 2',
  },
  {
    label: 'label 3',
    children: 'content 3',
  },
  {
    label: 'label 4',
    children: 'content 4',
  },
  {
    label: 'label 5',
    children: 'content 5',
  },
]

storiesOf('DescriptionList', module).add('all', () => (
  <Wrapper>
    <Title type="sectionTitle">single column</Title>
    <Content>
      <DescriptionList items={DescriptionListItems} layout="single"></DescriptionList>
    </Content>

    <Title type="sectionTitle">two column</Title>
    <Content>
      <DescriptionList items={DescriptionListItems} layout="double"></DescriptionList>
    </Content>

    <Title type="sectionTitle">three column</Title>
    <Content>
      <DescriptionList items={DescriptionListItems} layout="triple"></DescriptionList>
    </Content>
  </Wrapper>
))

const Wrapper = styled.div`
  padding: 24px;
`

const Title = styled(Heading)`
  margin: 0 0 16px;
`

const Content = styled(Base)`
  margin: 0 0 32px;
  padding: 24px;
`
