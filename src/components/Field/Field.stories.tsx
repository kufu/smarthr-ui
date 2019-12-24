import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'

import { Field } from './Field'

storiesOf('Field', module).add('all', () => (
  <List>
    <li>
      <Field label="string" defaultValue="string" />
    </li>
    <li>
      <Field type="number" label="number" defaultValue={1} />
    </li>
    <li>
      <Field type="password" label="password" defaultValue="password" />
    </li>
    <li>
      <Field
        name="sample"
        label="long title.........................................."
        defaultValue="string"
      />
    </li>
    <li>
      <Field label="required" defaultValue="string" required />
    </li>
    <li>
      <Field label="disabled" disabled />
    </li>
    <li>
      <Field label="width" defaultValue="width: 100%" width="100%" />
    </li>
    <li>
      <Field label="placeholder" placeholder="placeholder" />
    </li>
    <li>
      <Field label="onChange" onChange={action('onChange!!')} />
    </li>
    <li>
      <Field label="onBlur" onBlur={action('onBlur!!')} />
    </li>
    <li>
      <Field label="help message" helpMessage="This is help message." width={400} />
    </li>
    <li>
      <Field label="error message" errorMessage="An error occurred" />
    </li>
    <li>
      <Field label="custom field">
        <CustomTag>It is a field where tags can be freely inserted.</CustomTag>
      </Field>
    </li>
    <li>
      <Field
        label="custom field"
        errorMessage="custom error"
        helpMessage="This is help message."
        required
      >
        <CustomTag>It is a field where tags can be freely inserted.</CustomTag>
      </Field>
    </li>
  </List>
))

const List = styled.ul`
  padding: 0 24px;
  list-style: none;

  & > li:not(:first-child) {
    margin-top: 16px;
  }
`
const CustomTag = styled.div`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`
