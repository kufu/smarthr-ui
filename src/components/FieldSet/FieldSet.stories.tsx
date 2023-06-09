import { action } from '@storybook/addon-actions'
import { Story } from '@storybook/react'
import * as React from 'react'
import styled, { css } from 'styled-components'

import { useTheme } from '../../hooks/useTheme'
import { FaExclamationCircleIcon } from '../Icon'

import { FieldSet } from './FieldSet'

export default {
  title: 'Forms（フォーム）/FieldSet（非推奨）',
  component: FieldSet,
  parameters: {
    withTheming: true,
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
        <FieldSet type="number" label={<b>number</b>} defaultValue={1} />
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
              <FaExclamationCircleIcon color={themes.color.TEXT_GREY} />
              <SuffixText>suffix text</SuffixText>
            </Suffix>
          }
        />
      </li>
      <li>
        <FieldSet label="custom field">
          <CustomTag>It is a field where tags can be freely inserted.</CustomTag>
        </FieldSet>
      </li>
      <li>
        <FieldSet
          label="many parts"
          errorMessage={[
            'First error message.',
            <b key="Second error message.">Second error message.</b>,
          ]}
          helpMessage={
            <>
              This is help message.
              <br />
              This is help message.
            </>
          }
          labelSuffix={
            <Suffix>
              <FaExclamationCircleIcon color={themes.color.TEXT_GREY} />
              <SuffixText>suffix text</SuffixText>
            </Suffix>
          }
          required
        >
          <CustomTag>It is a field where tags can be freely inserted.</CustomTag>
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
const SuffixText = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSize.S};
`
const CustomTag = styled.div(
  ({ theme }) => css`
    padding: 10px;
    border: 1px solid ${theme.color.BORDER};
    border-radius: 5px;
  `,
)
