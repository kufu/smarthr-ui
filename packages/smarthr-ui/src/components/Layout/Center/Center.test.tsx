import { render, screen } from '@testing-library/react'

import { Center } from './Center'

describe('Center', () => {
  test('style propのみでminHeight/maxWidthを指定した場合、反映されること', () => {
    render(<Center style={{ minHeight: 100, maxWidth: 200, color: 'red' }}>content</Center>)
    const el = screen.getByText('content')

    expect(el).toHaveStyle('min-height: 100px')
    expect(el).toHaveStyle('max-width: 200px')
    expect(el).toHaveStyle('color: rgb(255, 0, 0)')
  })

  test('minHeight/maxWidth propとstyle propを両方指定した場合、propの値が優先されること', () => {
    render(
      <Center minHeight={100} maxWidth={200} style={{ minHeight: 10, maxWidth: 20 }}>
        content
      </Center>,
    )
    const el = screen.getByText('content')

    expect(el).toHaveStyle('min-height: 100px')
    expect(el).toHaveStyle('max-width: 200px')
  })
})
