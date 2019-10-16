import { mount } from 'enzyme'
import React from 'react'

import { StatusLabel } from '../StatusLabel'

describe('StatusLabel', () => {
  const hello = 'hello'
  it('should be match snapshot', () => {
    const component = mount(<StatusLabel type="success">{hello}</StatusLabel>)
    expect(component).toMatchSnapshot()
  })
  it('should render given children', () => {
    const wrapper = mount(<StatusLabel type="success">{hello}</StatusLabel>)
    expect(wrapper.text()).toBe(hello)
  })
  it('should have given type', () => {
    const wrapper = mount(<StatusLabel type="success">{hello}</StatusLabel>)
    expect(wrapper.prop('type')).toBe('success')
  })
})
