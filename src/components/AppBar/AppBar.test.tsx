import { mount } from 'enzyme'
import React from 'react'
import ReactTestRenderer from 'react-test-renderer'

import { AppBar } from './AppBar'

describe('AppBar', () => {
  it('should be match snapshot', () => {
    const component = mount(<AppBar />)
    expect(component).toMatchSnapshot()
  })

  it('should be able to render without crashing', () => {
    ReactTestRenderer.create(<AppBar />)
  })
})
