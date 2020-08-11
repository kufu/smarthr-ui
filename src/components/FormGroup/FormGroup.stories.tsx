import { storiesOf } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'

import { FormGroup } from './FormGroup'
import { Input } from '../Input'

import readme from './README.md'

type SampleChildrenProps = {
  id1?: string
  id2?: string
  disabled?: boolean
}

const SampleChildren: React.FC<SampleChildrenProps> = ({ id1, id2, disabled }) => {
  return (
    <SampleWrapper>
      <SampleFormGroup
        label="first name"
        labelType="subSubBlockTitle"
        innerMargin="XXS"
        labelId={id1}
        disabled={disabled}
      >
        <Input aria-labelledby={id1} disabled={disabled} />
      </SampleFormGroup>
      <SampleFormGroup
        label="last name"
        labelType="subSubBlockTitle"
        innerMargin="XXS"
        labelId={id2}
        disabled={disabled}
      >
        <Input aria-labelledby={id2} disabled={disabled} />
      </SampleFormGroup>
    </SampleWrapper>
  )
}

const SampleStatusLabels = [
  {
    type: 'required' as const,
    children: 'label 1' as const,
  },
  {
    type: 'success' as const,
    children: 'label 2' as const,
  },
]

storiesOf('FormGroup', module)
  .addParameters({
    readme: {
      sidebar: readme,
    },
  })
  .add('all', () => (
    <Wrapper>
      <Title>default</Title>
      <Body>
        <FormGroup label="Title" labelType="blockTitle">
          <SampleChildren id1="id_1-1" id2="id_1-2" />
        </FormGroup>
      </Body>
      <Title>with status label</Title>
      <Body>
        <FormGroup label="Title" labelType="blockTitle" statusLabels={SampleStatusLabels}>
          <SampleChildren id1="id_2-1" id2="id_2-2" />
        </FormGroup>
      </Body>
      <Title>with help message</Title>
      <Body>
        <FormGroup label="Title" labelType="blockTitle" helpMessage="help message text">
          <SampleChildren id1="id_3-1" id2="id_3-2" />
        </FormGroup>
      </Body>
      <Title>with error messages</Title>
      <Body>
        <FormGroup
          label="Title"
          labelType="blockTitle"
          errorMessages={['error message 1', 'error message 2']}
        >
          <SampleChildren id1="id_4-1" id2="id_4-2" />
        </FormGroup>
      </Body>
      <Title>with all options</Title>
      <Body>
        <FormGroup
          label="Title"
          labelType="blockTitle"
          statusLabels={SampleStatusLabels}
          helpMessage="help message text"
          errorMessages={['error message 1', 'error message 2']}
        >
          <SampleChildren id1="id_5-1" id2="id_5-2" />
        </FormGroup>
      </Body>
      <Title>disabled</Title>
      <Body>
        <FormGroup
          label="Title"
          labelType="blockTitle"
          statusLabels={SampleStatusLabels}
          helpMessage="help message text"
          errorMessages={['error message 1', 'error message 2']}
          disabled
        >
          <SampleChildren id1="id_6-1" id2="id_6-2" disabled />
        </FormGroup>
      </Body>
    </Wrapper>
  ))

const Wrapper = styled.dl`
  display: block;
  padding: 24px;
  margin: 0;
`

const Title = styled.dt`
  display: block;
  padding: 0;
  margin: 0 0 16px;
  color: #707070;
  font-style: italic;
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
