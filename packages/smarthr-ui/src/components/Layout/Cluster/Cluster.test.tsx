import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { MainContent } from '../MainContent'
import { SubContent } from '../SubContent'

import { Cluster } from './Cluster'

describe('Cluster', () => {
  it('layout="main sub"を指定した場合、data-layout属性が設定される', () => {
    const { container } = render(
      <Cluster layout="main sub">
        <MainContent>Main</MainContent>
        <SubContent>Sub</SubContent>
      </Cluster>,
    )
    expect(container.firstChild).toHaveAttribute('data-layout', 'main sub')
  })

  it('layout="sub main"を指定した場合、data-layout属性が設定される', () => {
    const { container } = render(
      <Cluster layout="sub main">
        <SubContent>Sub</SubContent>
        <MainContent>Main</MainContent>
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

describe('MainContent', () => {
  it('smarthr-ui-Cluster-layout-MainContentクラスが設定される', () => {
    render(<MainContent>Content</MainContent>)
    const element = screen.getByText('Content')
    expect(element).toHaveClass('smarthr-ui-Cluster-layout-MainContent')
  })

  it('minWidthを指定した場合、style属性が設定される', () => {
    render(<MainContent minWidth="300px">Content</MainContent>)
    const element = screen.getByText('Content')
    expect(element).toHaveStyle({ minWidth: '300px' })
  })

  it('maxWidthを指定した場合、style属性が設定される', () => {
    render(<MainContent maxWidth="800px">Content</MainContent>)
    const element = screen.getByText('Content')
    expect(element).toHaveStyle({ maxWidth: '800px' })
  })

  it('minWidthに数値を指定した場合、pxに変換される', () => {
    render(<MainContent minWidth={300}>Content</MainContent>)
    const element = screen.getByText('Content')
    expect(element).toHaveStyle({ minWidth: '300px' })
  })

  it('asでsectioning contentを指定した場合、対応する要素がレンダリングされる', () => {
    const { container } = render(<MainContent as="article">Content</MainContent>)
    expect(container.querySelector('article')).toBeInTheDocument()
  })
})

describe('SubContent', () => {
  it('smarthr-ui-Cluster-layout-SubContentクラスが設定される', () => {
    render(<SubContent>Content</SubContent>)
    const element = screen.getByText('Content')
    expect(element).toHaveClass('smarthr-ui-Cluster-layout-SubContent')
  })

  it('minWidthを指定した場合、style属性が設定される', () => {
    render(<SubContent minWidth="200px">Content</SubContent>)
    const element = screen.getByText('Content')
    expect(element).toHaveStyle({ minWidth: '200px' })
  })

  it('maxWidthを指定した場合、style属性が設定される', () => {
    render(<SubContent maxWidth="400px">Content</SubContent>)
    const element = screen.getByText('Content')
    expect(element).toHaveStyle({ maxWidth: '400px' })
  })

  it('asでsectioning contentを指定した場合、対応する要素がレンダリングされる', () => {
    const { container } = render(<SubContent as="aside">Content</SubContent>)
    expect(container.querySelector('aside')).toBeInTheDocument()
  })
})
