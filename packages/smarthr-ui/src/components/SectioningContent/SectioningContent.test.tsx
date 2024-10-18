/* eslint-disable smarthr/a11y-heading-in-sectioning-content */
import { render } from '@testing-library/react'
import React from 'react'

import { Heading, PageHeading } from '../Heading'

import { Article, Aside, Nav, Section } from './SectioningContent'

describe('SectioningContent', () => {
  it('<Section> を使用すると section 要素が描画されること', async () => {
    const { container } = render(<Section></Section>)
    expect(container.querySelector('section')).toBeInTheDocument()
  })

  it('<Article> を使用すると article 要素が描画されること', async () => {
    const { container } = render(<Article></Article>)
    expect(container.querySelector('article')).toBeInTheDocument()
  })

  it('<Aside> を使用すると aside 要素が描画されること', async () => {
    const { container } = render(<Aside></Aside>)
    expect(container.querySelector('aside')).toBeInTheDocument()
  })

  it('<Nav> を使用すると nav 要素が描画されること', async () => {
    const { container } = render(<Nav></Nav>)
    expect(container.querySelector('nav')).toBeInTheDocument()
  })

  it('SectioningContent 直下の見出しレベルはデフォルトで2になること', async () => {
    const { container } = render(
      <Section>
        <Heading>Heading</Heading>
      </Section>,
    )
    expect(container.querySelector('h2')).toBeInTheDocument()
  })

  it('SectioningContent の見出しレベルは baseLevel で上書きできること', async () => {
    const { container } = render(
      <Section baseLevel={3}>
        <Heading>Heading</Heading>
      </Section>,
    )
    expect(container.querySelector('h3')).toBeInTheDocument()
  })

  it('SectioningContent がネストされた場合、見出しレベルがインクリメントされること', async () => {
    const { container } = render(
      <Section>
        <Heading>level 2</Heading>
        <Section>
          <Heading>level 3</Heading>
          <Section>
            <Heading>level 4</Heading>
            <Section>
              <Heading>level 5</Heading>
              <Section>
                <Heading>level 6</Heading>
              </Section>
            </Section>
          </Section>
        </Section>
      </Section>,
    )
    expect(container.querySelector('h2')).toHaveTextContent('level 2')
    expect(container.querySelector('h3')).toHaveTextContent('level 3')
    expect(container.querySelector('h4')).toHaveTextContent('level 4')
    expect(container.querySelector('h5')).toHaveTextContent('level 5')
    expect(container.querySelector('h6')).toHaveTextContent('level 6')
  })

  it('SectioningContent が並列にある場合、それぞれの見出しレベルは独立してインクリメントすること', async () => {
    render(
      <Section>
        <Heading>level 2</Heading>
        <Section>
          <Heading>level 3-1</Heading>
          <Section>
            <Heading>level 4-1</Heading>
          </Section>
        </Section>
        <Section>
          <Heading>level 3-2</Heading>
          <Section>
            <Heading>level 4-2</Heading>
          </Section>
        </Section>
      </Section>,
    )

    expect(document.querySelector('h2')).toHaveTextContent('level 2')
    expect(document.querySelectorAll('h3')[0]).toHaveTextContent('level 3-1')
    expect(document.querySelectorAll('h3')[1]).toHaveTextContent('level 3-2')
    expect(document.querySelectorAll('h4')[0]).toHaveTextContent('level 4-1')
    expect(document.querySelectorAll('h4')[1]).toHaveTextContent('level 4-2')
  })

  it('SectioningContent に含まれる見出し要素は、見出しレベルが6を超えると span になり、role と aria-level が設定される', async () => {
    const { container } = render(
      <Section>
        <Heading>level 2</Heading>
        <Section>
          <Heading>level 3</Heading>
          <Section>
            <Heading>level 4</Heading>
            <Section>
              <Heading>level 5</Heading>
              <Section>
                <Heading>level 6</Heading>
                <Section>
                  <Heading>level 7</Heading>
                </Section>
              </Section>
            </Section>
          </Section>
        </Section>
      </Section>,
    )
    expect(container.querySelector('span')).toHaveTextContent('level 7')
    expect(container.querySelector('span')).toHaveAttribute('role', 'heading')
    expect(container.querySelector('span')).toHaveAttribute('aria-level', '7')
  })

  it('SectioningContent には ref を渡すことができる', async () => {
    const ref = React.createRef<HTMLDivElement>()
    render(
      <Section ref={ref}>
        <Heading>heading</Heading>
      </Section>,
    )
    expect(ref.current?.querySelector('h2')).toBeInTheDocument()
  })

  it('SectioningContent に PageHeading が含まれている場合、見出しレベルは常に1になること', async () => {
    const { container } = render(
      <Section>
        <Section>
          <Section>
            <PageHeading>PageHeading</PageHeading>
          </Section>
        </Section>
      </Section>,
    )

    expect(container.querySelector('h1')).toHaveTextContent('PageHeading')
  })
})
