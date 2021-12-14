import { action } from '@storybook/addon-actions'
import { Story } from '@storybook/react'
import * as React from 'react'
import styled, { css } from 'styled-components'
import { Theme, useTheme } from '../../hooks/useTheme'

import { FaExclamationCircleIcon } from '../Icon'
import { FieldSet } from './FieldSet'
import readme from './README.md'

export default {
  title: 'FieldSet',
  component: FieldSet,
  parameters: {
    readme: {
      sidebar: readme,
    },
  },
}

export const All: Story = () => {
  const themes = useTheme()

  return (
    <List>
      <li>
        <FieldSet label="string" defaultValue="string" />
      </li>
      <li>
        <FieldSet type="number" label="number" defaultValue={1} />
      </li>
      <li>
        <FieldSet type="password" label="password" defaultValue="password" />
      </li>
      <li>
        <FieldSet
          name="sample"
          label="long title.........................................."
          defaultValue="string"
        />
      </li>
      <li>
        <FieldSet label="required" defaultValue="string" required />
      </li>
      <li>
        <FieldSet label="disabled" disabled />
      </li>
      <li>
        <FieldSet label="width" defaultValue="width: 100%" width="100%" />
      </li>
      <li>
        <FieldSet label="placeholder" placeholder="placeholder" />
      </li>
      <li>
        <FieldSet label="onChange" onChange={action('onChange!!')} />
      </li>
      <li>
        <FieldSet label="onBlur" onBlur={action('onBlur!!')} />
      </li>
      <li>
        <FieldSet label="help message" helpMessage="This is help message." width={400} />
      </li>
      <li>
        <FieldSet label="error message" errorMessage="An error occurred" />
      </li>
      <li>
        <FieldSet
          label="labelSuffix"
          labelSuffix={
            <Suffix>
              <FaExclamationCircleIcon size={12} color={themes.color.TEXT_GREY} />
              <SuffixText themes={themes}>suffix text</SuffixText>
            </Suffix>
          }
        />
      </li>
      <li>
        <FieldSet label="custom field">
          <CustomTag themes={themes}>It is a field where tags can be freely inserted.</CustomTag>
        </FieldSet>
      </li>
      <li>
        <FieldSet
          label="many parts"
          errorMessage={['First error message.', 'Second error message.']}
          helpMessage="This is help message."
          labelSuffix={
            <Suffix>
              <FaExclamationCircleIcon size={12} color={themes.color.TEXT_GREY} />
              <SuffixText themes={themes}>suffix text</SuffixText>
            </Suffix>
          }
          required
        >
          <CustomTag themes={themes}>It is a field where tags can be freely inserted.</CustomTag>
        </FieldSet>
      </li>
    </List>
  )
}
All.storyName = 'all'

const List = styled.ul`
  padding: 0 24px;
  list-style: none;

  & > li:not(:first-child) {
    margin-top: 16px;
  }
`
const Suffix = styled.div`
  display: flex;
  align-items: center;

  > *:first-child {
    margin-right: 4px;
  }
`
const SuffixText = styled.p<{ themes: Theme }>`
  margin: 0;
  font-size: ${({ themes }) => themes.fontSize.S};
`
const CustomTag = styled.div<{ themes: Theme }>`
  ${({ themes }) => {
    return css`
      padding: 10px;
      border: 1px solid ${themes.color.BORDER};
      border-radius: 5px;
    `
  }}
`
