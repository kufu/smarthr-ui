import { Story } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'

import { useTheme } from '../../hooks/useTheme'
import { Base } from '../Base'
import { Heading } from '../Heading'
import { FaExclamationCircleIcon } from '../Icon'
import { Text } from '../Text'

import { DefinitionList } from './DefinitionList'

export default {
  title: 'Data Display（データ表示）/DefinitionList',
  component: DefinitionList,
  parameters: {
    withTheming: true,
  },
}

const Item = () => {
  const themes = useTheme()
  return (
    <Term>
      <span>term 7</span>
      <Alert>
        <FaExclamationCircleIcon size={11} color={themes.color.DANGER} />
        <AlertText>error occurred</AlertText>
      </Alert>
    </Term>
  )
}

const DefinitionListItems = [
  {
    term: 'term 1',
    description: 'description 1',
  },
  {
    term: 'term 2',
    description: '-',
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
    term: <Item />,
    description: 'description 7',
  },
  {
    term: '折り返されたくない要素は nowrap',
    description: <Text whiteSpace="nowrap">so-much-longer-email-address@example.com</Text>,
  },
  {
    term: '標準は折返し',
    description: 'so-much-longer-email-address@example.com',
  },
  {
    term: 'term 9',
  },
]

export const All: Story = () => {
  return (
    <Wrapper>
      <Title type="sectionTitle">default</Title>
      <Content>
        <DefinitionList items={DefinitionListItems} />
      </Content>

      <Title type="sectionTitle">single column</Title>
      <Content>
        <DefinitionList items={DefinitionListItems} layout="single" />
      </Content>

      <Title type="sectionTitle">two column</Title>
      <Content>
        <DefinitionList items={DefinitionListItems} layout="double" />
      </Content>

      <Title type="sectionTitle">three column</Title>
      <Content>
        <DefinitionList items={DefinitionListItems} layout="triple" />
      </Content>
    </Wrapper>
  )
}
All.storyName = 'all'

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
  color: ${({ theme }) => theme.color.TEXT_BLACK};
  font-size: ${({ theme }) => theme.fontSize.S};
`
