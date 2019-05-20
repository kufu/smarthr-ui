import { mount } from 'enzyme'
import React from 'react'
import { Checkbox } from '../Checkbox'

describe('Checkbox', () => {
  it('should be able to match snapshot', () => {
    const component = mount(<Checkbox name="sample" checked={true} />)
    expect(component).toMatchSnapshot()
  })

  it('should be able to render with correct value of name and checked attribute', () => {
    const name = 'sample'
    const checked = false
    const component = mount(<Checkbox name={name} checked={checked} />)

    expect(component.find('input').prop('name')).toBe(name)
    expect(component.find('input').prop('checked')).toBe(checked)
  })

  it('should be able to render check icon if checked attribute is true', () => {
    const name = 'sample'
    const checked = true
    const component = mount(<Checkbox name={name} checked={checked} />)

    expect(component.find('svg')).toHaveLength(1)
    expect(component.find('input').prop('checked')).toBe(checked)
  })

  // it('should be able to run', () => {
  //   const name = 'sample'
  //   const checked = true
  //   const component = mount(<Checkbox name={name} checked={checked} />)
  // })
})
