import { create } from 'react-test-renderer'
import React from 'react'

import { CheckBoxLabel } from './CheckBoxLabel'

describe('CheckBoxLabel', () => {
  it('should be match snapshot', () => {
    const testRenderer = create(
      <CheckBoxLabel label="label" name="name" checked={true} disabled={false} />,
    )
    expect(testRenderer.toJSON()).toMatchSnapshot()
  })
})
