import React from 'react'
import { create } from 'react-test-renderer'

import { FaAddressCardIcon } from './Icon'

const Icon = () => (
  <>
    <span id="text">連絡帳</span>
    <FaAddressCardIcon />
    <FaAddressCardIcon alt="連絡帳" />
    <FaAddressCardIcon aria-label="連絡帳" />
    <FaAddressCardIcon aria-labelledby="text" />
  </>
)

describe('Icon', () => {
  it('should be match snapshot', () => {
    const testRenderer = create(<Icon />)
    expect(testRenderer.toJSON()).toMatchSnapshot()
  })
})
