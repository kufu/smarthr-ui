import { storiesOf } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'
import { Theme, useTheme } from '../../hooks/useTheme'
import { Heading } from '../Heading'
import { Base } from '../Base'
import { DefinitionList } from './DefinitionList'
import { FaExclamationCircleIcon } from '../Icon'

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

storiesOf('DefinitionList', module).add('all', () => {
  const themes = useTheme()
  return (
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
                    <FaExclamationCircleIcon size={11} color={themes.palette.DANGER} />
                    <AlertText themes={themes}>error occurred</AlertText>
                  </Alert>
                </Term>
              ),
              description: 'description 2',
            },
          ]}
        ></DefinitionList>
      </Content>
    </Wrapper>
  )
})

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
const AlertText = styled.span<{ themes: Theme }>`
  margin-left: 4px;
  color: ${({ themes }) => themes.palette.TEXT_BLACK};
  font-size: 11px;
`
