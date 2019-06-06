import { mount } from 'enzyme'
import React from 'react'
import { Flash } from '../Flash'

describe('Flash', () => {
  it('should not render if prop visible is false', () => {
    const visibleFlash = mount(
      <Flash type="danger" text="flash!!" onClose={() => {}} visible={true} />,
    )
    const invisibleFlash = mount(
      <Flash type="danger" text="flash!!" onClose={() => {}} visible={false} />,
    )

    expect(visibleFlash.text()).toEqual(expect.stringContaining('flash!!'))
    expect(invisibleFlash.text()).toEqual(expect.not.stringContaining('flash!!'))
  })

  it('should call onClose on click close button', () => {
    const spy = jest.fn()
    const wrapper = mount(<Flash type="success" text="flash!!" onClose={spy} visible={true} />)

    wrapper.find('button.close').simulate('click')

    expect(spy).toHaveBeenCalled()
  })
})
