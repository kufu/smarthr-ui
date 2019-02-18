import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'

import { Field, NumberField, PasswordField, TextField } from './Field'

storiesOf('Field', module).add('all', () => (
  <List>
    <li>
      <TextField name="sample" value="string" label="string" />
    </li>
    <li>
      <NumberField name="sample" value="1" label="number" />
    </li>
    <li>
      <PasswordField name="sample" value="password" label="password" />
    </li>
    <li>
      <TextField
        name="sample"
        value="string"
        label="long title.........................................."
      />
    </li>
    <li>
      <TextField name="sample" value="string" label="required" required={true} />
    </li>
    <li>
      <TextField name="sample" value="" label="disabled" disabled={true} />
    </li>
    <li>
      <TextField name="sample" value="width: 100%" label="width" width="100%" />
    </li>
    <li>
      <TextField name="sample" value="" label="placeholder" placeholder="placeholder" />
    </li>
    <li>
      <TextField name="sample" value="" label="onChange" onChange={action('onChange!!')} />
    </li>
    <li>
      <TextField name="sample" value="" label="onBlur" onBlur={action('onBlur!!')} />
    </li>
    <li>
      <TextField
        name="sample"
        value=""
        label="help message"
        help="This is help message."
        width={400}
      />
    </li>
    <li>
      <TextField name="sample" value="" label="error message" error="An error occurred" />
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
