import { mount } from 'enzyme'
import React from 'react'

import { Base } from '../Base'

describe('Base', () => {
  it('should render given children', () => {
    const hello = 'hello'
    const wrapper = mount(
      <Base>
        <p>{hello}</p>
      </Base>,
    )

    expect(wrapper.find('p')).toHaveLength(1)
    expect(wrapper.find('p').text()).toBe(hello)
  })
})
