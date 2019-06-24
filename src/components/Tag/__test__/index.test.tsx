import { mount } from 'enzyme'
import React from 'react'

import { Tag } from '../Tag'

describe('Tag', () => {
  it('should render given children', () => {
    const hello = 'hello'
    const wrapper = mount(<Tag type="success">{hello}</Tag>)

    expect(wrapper.text()).toBe(hello)
  })
  it('should have given type', () => {
    const hello = 'hello'
    const wrapper = mount(
      <Tag type="success" skeleton={true}>
        {hello}
      </Tag>,
    )

    expect(wrapper.prop('type')).toBe('success')
    expect(wrapper.prop('skeleton')).toBeTruthy()
  })
})
