import React from 'react'
import ReactTestRenderer from 'react-test-renderer'
import { AppBar } from './'

describe('index', () => {
  it('should be able to render without crashing', () => {
    ReactTestRenderer.create(<AppBar />)
  })
})
