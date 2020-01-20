import { storiesOf } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'
import { Heading } from '../Heading'
import { Base } from '../Base'
import { DefinitionList } from './DefinitionList'
import { Icon } from '../Icon'

const DefinitionListItems = [
  {
    term: 'term 1',
    description: 'description 1',
  },
  {
    term: 'term 2',
    description: 'description 2',
  },
  {
    term: 'term 3',
    description: 'description 3',
  },
  {
    term: 'term 4',
    description: 'description 4',
  },
  {
    term: 'term 5',
    description: 'description 5',
  },
]

storiesOf('DefinitionList', module).add('all', () => (
  <Wrapper>
    <Title type="sectionTitle">single column</Title>
    <Content>
      <DefinitionList items={DefinitionListItems} layout="single"></DefinitionList>
    </Content>

    <Title type="sectionTitle">two column</Title>
    <Content>
      <DefinitionList items={DefinitionListItems} layout="double"></DefinitionList>
    </Content>

    <Title type="sectionTitle">three column</Title>
    <Content>
      <DefinitionList items={DefinitionListItems} layout="triple"></DefinitionList>
    </Content>

    <Title type="sectionTitle">customized</Title>
    <Content>
      <DefinitionList
        items={[
          {
            term: 'term 1',
            description: 'description 1',
          },
          {
            term: (
              <Term>
                <span>term 2</span>
                <Alert>
                  <Icon name="fa-exclamation-circle" size={11} color="#ef475b" />
                  <AlertText>error occurred</AlertText>
                </Alert>
              </Term>
            ),
            description: 'description 2',
          },
        ]}
      ></DefinitionList>
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
const Term = styled.span`
  display: flex;
  align-items: center;
`
const Alert = styled.span`
  display: flex;
  align-items: center;
  margin-left: 8px;
`
const AlertText = styled.span`
  margin-left: 4px;
  color: #333;
  font-size: 11px;
`
