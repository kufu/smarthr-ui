import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Cluster } from './Cluster'

describe('Cluster', () => {
  it('layout="main sub"を指定した場合、data-layout属性が設定される', () => {
    const { container } = render(
      <Cluster layout="main sub">
        <div>Main</div>
        <div>Sub</div>
      </Cluster>,
    )
    expect(container.firstChild).toHaveAttribute('data-layout', 'main sub')
  })

  it('layout="sub main"を指定した場合、data-layout属性が設定される', () => {
    const { container } = render(
      <Cluster layout="sub main">
        <div>Sub</div>
        <div>Main</div>
      </Cluster>,
    )
    expect(container.firstChild).toHaveAttribute('data-layout', 'sub main')
  })

  it('layoutを指定しない場合、data-layout属性は設定されない', () => {
    const { container } = render(
      <Cluster>
        <div>Item 1</div>
        <div>Item 2</div>
      </Cluster>,
    )
    expect(container.firstChild).not.toHaveAttribute('data-layout')
  })
})
