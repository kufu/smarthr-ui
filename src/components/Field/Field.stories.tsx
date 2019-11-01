import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'

import { Field } from './Field'

storiesOf('Field', module).add('all', () => (
  <List>
    <li>
      <Field label="string" input={{ defaultValue: 'string' }} />
    </li>
    <li>
      <Field label="number" input={{ type: 'number', defaultValue: '1' }} />
    </li>
    <li>
      <Field label="password" input={{ type: 'password', defaultValue: 'password' }} />
    </li>
    <li>
      <Field
        label="long title.........................................."
        input={{ name: 'sample', defaultValue: 'string' }}
      />
    </li>
    <li>
      <Field label="required" input={{ required: true, defaultValue: 'string' }} />
    </li>
    <li>
      <Field label="disabled" input={{ disabled: true }} />
    </li>
    <li>
      <Field label="width" input={{ width: '100%', defaultValue: 'width: 100%' }} />
    </li>
    <li>
      <Field label="placeholder" input={{ placeholder: 'placeholder' }} />
    </li>
    <li>
      <Field label="onChange" input={{ onChange: action('onChange!!') }} />
    </li>
    <li>
      <Field label="onBlur" input={{ onBlur: action('onBlur!!') }} />
    </li>
    <li>
      <Field label="help message" helpMessage="This is help message." input={{ width: 400 }} />
    </li>
    <li>
      <Field label="error message" errorMessage="An error occurred" input={{ error: true }} />
    </li>
    <li>
      <Field label="custom field">
        <CustomTag>It is a field where tags can be freely inserted.</CustomTag>
      </Field>
    </li>
    <li>
      <Field label="custom field" errorMessage="custom error" input={{ required: true }}>
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
