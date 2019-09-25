import { mount } from 'enzyme'
import React from 'react'

import { Checkbox } from './Checkbox'

describe('Checkbox', () => {
  it('should be match snapshot', () => {
    const component = mount(<Checkbox name="sample" checked={true} />)
    expect(component).toMatchSnapshot()
  })

  it('should be render with value of name and checked attribute', () => {
    const name = 'sample'
    const checked = false
    const component = mount(<Checkbox name={name} checked={checked} />)

    expect(component.find('input').prop('name')).toBe(name)
    expect(component.find('input').prop('checked')).toBe(checked)
  })

  it('should be render check icon if checked attribute is true', () => {
    const name = 'sample'
    const checked = true
    const component = mount(<Checkbox name={name} checked={checked} />)

    expect(component.find('svg')).toHaveLength(1)
    expect(component.find('input').prop('checked')).toBe(checked)
  })

  it('should be not render check icon if checked attribute is false', () => {
    const name = 'sample'
    const checked = false
    const component = mount(<Checkbox name={name} checked={checked} />)

    expect(component.find('svg')).toHaveLength(0)
    expect(component.find('input').prop('checked')).toBe(checked)
  })

  it('should be call onChange with name and checked', () => {
    const name = 'sample'
    const checked = true
    const spy = jest.fn()
    const component = mount(<Checkbox name={name} checked={checked} onChange={spy} />)
    component.find('input').simulate('change')
    expect(spy).toHaveBeenCalledWith(name, !checked)
  })
})
