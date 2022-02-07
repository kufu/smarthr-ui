import { Story } from '@storybook/react'
import * as React from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'

import { FormGroup } from './FormGroup'
import { Input } from '../Input'

import readme from './README.md'

export default {
  title: 'FormGroup',
  component: FormGroup,
  parameters: {
    readme: {
      sidebar: readme,
    },
  },
}

type SampleChildrenProps = {
  id1?: string
  id2?: string
  disabled?: boolean
}

const SampleChildren: React.VFC<SampleChildrenProps> = ({ id1, id2, disabled }) => {
  return (
    <SampleWrapper>
      <SampleFormGroup
        title="first name"
        titleType="subSubBlockTitle"
        innerMargin="XXS"
        htmlFor={id1}
        disabled={disabled}
      >
        <Input id={id1} disabled={disabled} />
      </SampleFormGroup>
      <SampleFormGroup
        title="last name"
        titleType="subSubBlockTitle"
        innerMargin="XXS"
        htmlFor={id2}
        disabled={disabled}
      >
        <Input id={id2} disabled={disabled} />
      </SampleFormGroup>
    </SampleWrapper>
  )
}

const SampleStatusLabelProps = [
  {
    type: 'required' as const,
    children: 'label 1' as const,
  },
  {
    type: 'success' as const,
    children: 'label 2' as const,
  },
]

export const All: Story = () => {
  const theme = useTheme()

  return (
    <Wrapper>
      <Title themes={theme}>default</Title>
      <Body>
        <FormGroup title="Title" titleType="blockTitle" role="group">
          <SampleChildren id1="id_1-1" id2="id_1-2" />
        </FormGroup>
      </Body>
      <Title themes={theme}>with status label</Title>
      <Body>
        <FormGroup
          title="Title"
          titleType="blockTitle"
          statusLabelProps={SampleStatusLabelProps}
          role="group"
        >
          <SampleChildren id1="id_2-1" id2="id_2-2" />
        </FormGroup>
      </Body>
      <Title themes={theme}>with help message</Title>
      <Body>
        <FormGroup
          title="Title"
          titleType="blockTitle"
          helpMessage="help message text"
          role="group"
        >
          <SampleChildren id1="id_3-1" id2="id_3-2" />
        </FormGroup>
      </Body>
      <Title themes={theme}>with error messages</Title>
      <Body>
        <FormGroup
          title="Title"
          titleType="blockTitle"
          statusLabelProps={SampleStatusLabelProps}
          errorMessages={['error message 1', 'error message 2']}
          role="group"
        >
          <SampleChildren id1="id_4-1" id2="id_4-2" />
        </FormGroup>
      </Body>
      <Title themes={theme}>with all options</Title>
      <Body>
        <FormGroup
          title="Title"
          titleType="blockTitle"
          statusLabelProps={SampleStatusLabelProps}
          helpMessage="help message text"
          errorMessages={['error message 1', 'error message 2']}
          role="group"
        >
          <SampleChildren id1="id_5-1" id2="id_5-2" />
        </FormGroup>
      </Body>
      <Title themes={theme}>disabled</Title>
      <Body>
        <FormGroup
          title="Title"
          titleType="blockTitle"
          statusLabelProps={SampleStatusLabelProps}
          helpMessage="help message text"
          errorMessages="error message"
          disabled
          role="group"
        >
          <SampleChildren id1="id_6-1" id2="id_6-2" disabled />
        </FormGroup>
      </Body>
    </Wrapper>
  )
}
All.storyName = 'all'

const Wrapper = styled.dl`
  display: block;
  padding: 24px;
  margin: 0;
`

const Title = styled.dt<{ themes: Theme }>`
  ${({ themes }) => css`
    display: block;
    padding: 0;
    margin: 0 0 16px;
    color: ${themes.color.TEXT_GREY};
    font-style: italic;
  `}
`

const Body = styled.dd`
  display: block;
  padding: 0;
  margin: 0 0 32px;
`

const SampleWrapper = styled.div`
  display: flex;
  align-items: flex-start;
`

const SampleFormGroup = styled(FormGroup)`
  margin-right: 16px;
`
