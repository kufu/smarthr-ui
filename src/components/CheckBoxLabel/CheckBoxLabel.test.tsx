import { mount } from 'enzyme'
import React from 'react'

import { CheckBoxLabel } from './CheckBoxLabel'

describe('CheckBoxLabel', () => {
  it('should be match snapshot', () => {
    const component = mount(
      <CheckBoxLabel
        label="label"
        name="name"
        checked={true}
        disabled={false}
        aria-checked="true"
      />,
    )
    expect(component).toMatchSnapshot()
  })
})
