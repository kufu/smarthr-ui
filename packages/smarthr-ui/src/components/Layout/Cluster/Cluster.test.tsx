import { render } from '@testing-library/react'

import { Cluster } from './Cluster'

describe('Cluster', () => {
  it('growを指定しない場合、data-grow属性は設定されない', () => {
    const { container } = render(
      <Cluster>
        <div>Item 1</div>
        <div>Item 2</div>
      </Cluster>,
    )
    expect(container.firstChild).not.toHaveAttribute('data-grow')
  })

  it('grow="start"を指定した場合、data-grow属性が設定される', () => {
    const { container } = render(
      <Cluster grow="start">
        <div>Start</div>
        <div>End</div>
      </Cluster>,
    )
    expect(container.firstChild).toHaveAttribute('data-grow', 'start')
  })

  it('grow="end"を指定した場合、data-grow属性が設定される', () => {
    const { container } = render(
      <Cluster grow="end">
        <div>Start</div>
        <div>End</div>
      </Cluster>,
    )
    expect(container.firstChild).toHaveAttribute('data-grow', 'end')
  })

  it('3要素以上の構成でも、grow="start"/"end"をそのまま指定できる', () => {
    const { container } = render(
      <Cluster grow="start">
        <div>Start</div>
        <div>Middle</div>
        <div>End</div>
      </Cluster>,
    )
    expect(container.firstChild).toHaveAttribute('data-grow', 'start')
    expect(container.firstChild?.childNodes).toHaveLength(3)
  })
})
