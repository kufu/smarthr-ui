import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'

import { Field } from './Field'

storiesOf('Field', module).add('all', () => (
  <List>
    <li>
      <Field defaultValue="string" label="string" />
    </li>
    <li>
      <Field type="number" defaultValue="1" label="number" />
    </li>
    <li>
      <Field type="password" defaultValue="password" label="password" />
    </li>
    <li>
      <Field
        name="sample"
        defaultValue="string"
        label="long title.........................................."
      />
    </li>
    <li>
      <Field defaultValue="string" label="required" required={true} />
    </li>
    <li>
      <Field label="disabled" disabled={true} />
    </li>
    <li>
      <Field defaultValue="width: 100%" label="width" width="100%" />
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
      <Field label="help message" help="This is help message." width={400} />
    </li>
    <li>
      <Field label="error message" error="An error occurred" />
    </li>
    <li>
      <Field label="custom field">
        <CustomTag>It is a field where tags can be freely inserted.</CustomTag>
      </Field>
    </li>
    <li>
      <Field label="custom field" error="custom error" required={true}>
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
