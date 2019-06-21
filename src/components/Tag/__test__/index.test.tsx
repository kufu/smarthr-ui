import { mount } from 'enzyme'
import React from 'react'

import { Tag } from '../Tag'

describe('Tag', () => {
  it('should render given children', () => {
    const hello = 'hello'
    const wrapper = mount(<Tag type="success">{hello}</Tag>)

    expect(wrapper.text()).toBe(hello)
  })
})
