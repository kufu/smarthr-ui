import { render, screen } from '@testing-library/react'

import { Center } from './Center'

describe('Center', () => {
  test('style propを指定した場合、minHeight/maxWidthとマージされて反映されること', () => {
    render(
      <Center minHeight={100} maxWidth={200} style={{ color: 'red' }}>
        content
      </Center>,
    )
    const el = screen.getByText('content')
    expect(el).toHaveStyle('color: rgb(255, 0, 0)')
    expect(el).toHaveStyle('min-height: 100px')
    expect(el).toHaveStyle('max-width: 200px')
  })
})
