import { mount } from 'enzyme'
import React from 'react'

import { CheckboxLabel } from './CheckboxLabel'

describe('CheckboxLabel', () => {
  it('should be match snapshot', () => {
    const component = mount(
      <CheckboxLabel label="label" name="name" checked={true} disabled={false} />,
    )
    expect(component).toMatchSnapshot()
  })
})
