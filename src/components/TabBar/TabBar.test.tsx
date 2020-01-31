import { mount } from 'enzyme'
import React from 'react'
import ReactTestRenderer from 'react-test-renderer'

import { TabBar } from './TabBar'
import { TabItem } from './TabItem'

const Tab = () => (
  <TabBar>
    <TabItem id="1" onClick={() => undefined}>
      Tab
    </TabItem>
    <TabItem id="2" onClick={() => undefined} selected>
      Selected
    </TabItem>
    <TabItem id="3" onClick={() => undefined} disabled>
      Disabled
    </TabItem>
  </TabBar>
)

describe('TabBar', () => {
  it('should be match snapshot', () => {
    const component = mount(<Tab />)
    expect(component).toMatchSnapshot()
  })

  it('should be able to render without crashing', () => {
    ReactTestRenderer.create(<Tab />)
  })
})
