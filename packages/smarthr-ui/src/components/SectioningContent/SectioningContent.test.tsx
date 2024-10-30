/* eslint-disable smarthr/a11y-heading-in-sectioning-content */
import { render } from '@testing-library/react'
import React, { ReactNode } from 'react'
import styled from 'styled-components'

import { Base } from '../Base'
import { Heading, PageHeading } from '../Heading'
import { Center, Cluster, Reel, Sidebar, Stack } from '../Layout'

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
      <Article baseLevel={3}>
        <Heading>Heading</Heading>
      </Article>,
    )
    expect(container.querySelector('h4')).toBeInTheDocument()
  })

  it('SectioningContent がネストされた場合、見出しレベルがインクリメントされること', async () => {
    const { container } = render(
      <Aside>
        <Heading>level 2</Heading>
        <Nav>
          <Heading>level 3</Heading>
          <Section>
            <Heading>level 4</Heading>
            <Article>
              <Heading>level 5</Heading>
              <Aside>
                <Heading>level 6</Heading>
              </Aside>
            </Article>
          </Section>
        </Nav>
      </Aside>,
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
        <Nav>
          <Heading>level 3-1</Heading>
          <Aside>
            <Heading>level 4-1</Heading>
          </Aside>
        </Nav>
        <Article>
          <Heading>level 3-2</Heading>
          <Section>
            <Heading>level 4-2</Heading>
          </Section>
        </Article>
      </Section>,
    )

    expect(document.querySelector('h2')).toHaveTextContent('level 2')
    expect(document.querySelectorAll('h3')[0]).toHaveTextContent('level 3-1')
    expect(document.querySelectorAll('h3')[1]).toHaveTextContent('level 3-2')
    expect(document.querySelectorAll('h4')[0]).toHaveTextContent('level 4-1')
    expect(document.querySelectorAll('h4')[1]).toHaveTextContent('level 4-2')
  })

  it('SectioningContent が直下でなく子孫でネストされた場合でも、それぞれの見出しレベルがインクリメントされること', async () => {
    render(
      <Section>
        <div>
          <Heading>level 2</Heading>
        </div>
        <div>
          <Section>
            <div>
              <Heading>level 3-1</Heading>
              <div>
                <Section>
                  <Heading>level 4-1</Heading>
                </Section>
              </div>
            </div>
          </Section>
        </div>
        <div>
          <Section>
            <div>
              <Heading>level 3-2</Heading>
              <div>
                <Section>
                  <div>
                    <Heading>level 4-2</Heading>
                  </div>
                </Section>
              </div>
            </div>
          </Section>
        </div>
      </Section>,
    )

    expect(document.querySelector('h2')).toHaveTextContent('level 2')
    expect(document.querySelectorAll('h3')[0]).toHaveTextContent('level 3-1')
    expect(document.querySelectorAll('h3')[1]).toHaveTextContent('level 3-2')
    expect(document.querySelectorAll('h4')[0]).toHaveTextContent('level 4-1')
    expect(document.querySelectorAll('h4')[1]).toHaveTextContent('level 4-2')
  })

  it('SectioningContent がネイティブ要素の場合も、見出しレベルがインクリメントされること', async () => {
    const { container } = render(
      <Section>
        <Heading>level 2</Heading>
        <section>
          <Heading>level 3</Heading>
          <article>
            <Heading>level 4</Heading>
            <aside>
              <Heading>level 5</Heading>
              <nav>
                <Heading>level 6</Heading>
              </nav>
            </aside>
          </article>
        </section>
      </Section>,
    )
    expect(container.querySelector('h2')).toHaveTextContent('level 2')
    expect(container.querySelector('h3')).toHaveTextContent('level 3')
    expect(container.querySelector('h4')).toHaveTextContent('level 4')
    expect(container.querySelector('h5')).toHaveTextContent('level 5')
    expect(container.querySelector('h6')).toHaveTextContent('level 6')
  })

  it('SectioningContent が StyledComponent でラップされている場合も、見出しレベルがインクリメントされること', async () => {
    const StyledSection = styled(Section)``
    const StyledArticle = styled(Article)``
    const StyledAside = styled(Aside)``
    const StyledNav = styled(Nav)``
    const StyledHeading = styled(Heading)``
    render(
      <StyledSection>
        <StyledHeading>level 2</StyledHeading>
        <StyledArticle>
          <StyledHeading>level 3</StyledHeading>
          <StyledAside>
            <StyledHeading>level 4</StyledHeading>
            <StyledNav>
              <StyledHeading>level 5</StyledHeading>
            </StyledNav>
          </StyledAside>
        </StyledArticle>
      </StyledSection>,
    )

    expect(document.querySelector('h2')).toHaveTextContent('level 2')
    expect(document.querySelector('h3')).toHaveTextContent('level 3')
    expect(document.querySelector('h4')).toHaveTextContent('level 4')
    expect(document.querySelector('h5')).toHaveTextContent('level 5')
  })
  ;[
    { name: 'Stack', Component: Stack },
    { name: 'Clusetr', Component: Cluster },
    { name: 'Center', Component: Center },
    { name: 'Base', Component: Base },
    { name: 'Reel', Component: Reel },
    { name: 'Sidebar', Component: Sidebar },
  ].forEach(({ name, Component }) => {
    // as で任意のコンポーネントになれるコンポーネントに対しても総当たりでテストする
    it(`SectioningContent に <${name} as="'article'|'aside'|'nav'|'section'"> がある場合も、見出しレベルがインクリメントされること`, async () => {
      const { container } = render(
        <Section>
          <Heading>level 2</Heading>
          <Component as="section">
            <Heading>level 3</Heading>
            <Component as="article">
              <Heading>level 4</Heading>
              <Component as="aside">
                <Heading>level 5</Heading>
                <Component as="nav">
                  <Heading>level 6</Heading>
                  <div></div>
                </Component>
              </Component>
            </Component>
          </Component>
        </Section>,
      )
      expect(container.querySelector('h2')).toHaveTextContent('level 2')
      expect(container.querySelector('h3')).toHaveTextContent('level 3')
      expect(container.querySelector('h4')).toHaveTextContent('level 4')
      expect(container.querySelector('h5')).toHaveTextContent('level 5')
      expect(container.querySelector('h6')).toHaveTextContent('level 6')
    })

    it(`SectioningContent に <Styled${name} as="'article'|'aside'|'nav'|'section'"> がある場合も、見出しレベルがインクリメントされること`, async () => {
      const StyledComponent = styled(Component)``
      const { container } = render(
        <Section>
          <Heading>level 2</Heading>
          <StyledComponent as="section">
            <Heading>level 3</Heading>
            <StyledComponent as="article">
              <Heading>level 4</Heading>
              <StyledComponent as="aside">
                <Heading>level 5</Heading>
                <StyledComponent as="nav">
                  <Heading>level 6</Heading>
                  <div></div>
                </StyledComponent>
              </StyledComponent>
            </StyledComponent>
          </StyledComponent>
        </Section>,
      )
      expect(container.querySelector('h2')).toHaveTextContent('level 2')
      expect(container.querySelector('h3')).toHaveTextContent('level 3')
      expect(container.querySelector('h4')).toHaveTextContent('level 4')
      expect(container.querySelector('h5')).toHaveTextContent('level 5')
      expect(container.querySelector('h6')).toHaveTextContent('level 6')
    })
  })

  it('SectioningContent に含まれる見出し要素は、見出しレベルが6を超えると span になり、role と aria-level が設定される', async () => {
    const { container } = render(
      <Nav>
        <Heading>level 2</Heading>
        <Section>
          <Heading>level 3</Heading>
          <Article>
            <Heading>level 4</Heading>
            <Aside>
              <Heading>level 5</Heading>
              <Section>
                <Heading>level 6</Heading>
                <Nav>
                  <Heading>level 7</Heading>
                </Nav>
              </Section>
            </Aside>
          </Article>
        </Section>
      </Nav>,
    )
    expect(container.querySelector('span')).toHaveTextContent('level 7')
    expect(container.querySelector('span')).toHaveAttribute('role', 'heading')
    expect(container.querySelector('span')).toHaveAttribute('aria-level', '7')
  })

  it.todo(
    'SectioningContent がカスタムコンポーネントでラップされている場合も、見出しレベルがインクリメントされること',
    async () => {
      const CustomSection: React.FC<{ children: ReactNode }> = ({ children }) => (
        <Section>{children}</Section>
      )
      render(
        <CustomSection>
          <Heading>level 2</Heading>
          <CustomSection>
            <Heading>level 3</Heading>
          </CustomSection>
        </CustomSection>,
      )

      expect(document.querySelector('h2')).toHaveTextContent('level 2')
      expect(document.querySelector('h3')).toHaveTextContent('level 3')
    },
  )

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
        <Aside>
          <Nav>
            <PageHeading>PageHeading</PageHeading>
          </Nav>
        </Aside>
      </Section>,
    )

    expect(container.querySelector('h1')).toHaveTextContent('PageHeading')
  })
})
