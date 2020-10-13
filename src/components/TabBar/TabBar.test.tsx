import { create } from 'react-test-renderer'
import React from 'react'

import { TabBar } from './TabBar'
import { TabItem } from './TabItem'

const Tab = () => (
  <TabBar>
    <TabItem id="1" onClick={jest.fn()}>
      Tab
    </TabItem>
    <TabItem id="2" onClick={jest.fn()} selected>
      Selected
    </TabItem>
    <TabItem id="3" onClick={jest.fn()} disabled>
      Disabled
    </TabItem>
  </TabBar>
)

describe('TabBar', () => {
  it('should be match snapshot', () => {
    const testRenderer = create(<Tab />)
    expect(testRenderer.toJSON()).toMatchSnapshot()
  })
})
