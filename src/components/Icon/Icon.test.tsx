import { create } from 'react-test-renderer'
import React from 'react'

import { FaAddressBookIcon } from './Icon'

const Icon = () => (
  <>
    <span id="text">連絡帳</span>
    <FaAddressBookIcon />
    <FaAddressBookIcon visuallyHiddenText="連絡帳" />
    <FaAddressBookIcon aria-label="連絡帳" />
    <FaAddressBookIcon aria-labelledby="text" />
  </>
)

describe('Icon', () => {
  it('should be match snapshot', () => {
    const testRenderer = create(<Icon />)
    expect(testRenderer.toJSON()).toMatchSnapshot()
  })
})
