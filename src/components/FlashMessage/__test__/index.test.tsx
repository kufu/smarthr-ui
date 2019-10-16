import { mount } from 'enzyme'
import React from 'react'
import { FlashMessage } from '../FlashMessage'

describe('FlashMessage', () => {
  it('should not render if prop visible is false', () => {
    const visibleFlashMessage = mount(
      <FlashMessage type="success" text="FlashMessage!!" onClose={() => {}} visible={true} />,
    )
    const invisibleFlashMessage = mount(
      <FlashMessage type="success" text="FlashMessage!!" onClose={() => {}} visible={false} />,
    )

    expect(visibleFlashMessage.text()).toEqual(expect.stringContaining('FlashMessage!!'))
    expect(invisibleFlashMessage.text()).toEqual(expect.not.stringContaining('FlashMessage!!'))
  })

  it('should call onClose on click close button', () => {
    const spy = jest.fn()
    const wrapper = mount(
      <FlashMessage type="success" text="FlashMessage!!" onClose={spy} visible={true} />,
    )

    wrapper.find('button.close').simulate('click')

    expect(spy).toHaveBeenCalled()
  })
})
