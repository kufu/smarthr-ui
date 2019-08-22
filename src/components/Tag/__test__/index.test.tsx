import { mount } from 'enzyme'
import React from 'react'

import { Tag } from '../Tag'

describe('Tag', () => {
  const hello = 'hello'
  it('should be match snapshot', () => {
    const component = mount(<Tag type="success">{hello}</Tag>)
    expect(component).toMatchSnapshot()
  })
  it('should render given children', () => {
    const wrapper = mount(<Tag type="success">{hello}</Tag>)
    expect(wrapper.text()).toBe(hello)
  })
  it('should have given type', () => {
    const wrapper = mount(<Tag type="success">{hello}</Tag>)
    expect(wrapper.prop('type')).toBe('success')
  })
})
