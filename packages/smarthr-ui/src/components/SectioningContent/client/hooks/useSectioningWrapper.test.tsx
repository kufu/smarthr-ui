import { renderHook } from '@testing-library/react'
import styled from 'styled-components'

import { SectioningFragment } from '../components'

import { useSectionWrapper } from './useSectioningWrapper'

describe('useSectionWrapper', () => {
  const sectioningContents = ['article', 'aside', 'nav', 'section'] as const
  const notSectioningContents = ['div', 'span', 'p', 'h1', 'ul', 'li', 'a'] as const

  it('sectioningContents に含まれる要素の場合、SectioningFragment が返ること', () => {
    sectioningContents.forEach((type) => {
      const { result } = renderHook(() => useSectionWrapper(type))
      expect(result.current).toBe(SectioningFragment)
    })
  })

  it('sectioningContents に含まれる要素が StyledComponent の場合、SectioningFragment が返ること', () => {
    sectioningContents.forEach((type) => {
      const component = styled[type]``
      const { result } = renderHook(() => useSectionWrapper(component))
      expect(result.current).toBe(SectioningFragment)
    })
  })

  it('sectioningContents に含まれない要素の場合、null が返ること', () => {
    notSectioningContents.forEach((type) => {
      const { result } = renderHook(() => useSectionWrapper(type))
      expect(result.current).toBe(null)
    })
  })

  it('sectioningContents に含まれない要素が StyledComponent の場合、null が返ること', () => {
    notSectioningContents.forEach((type) => {
      const component = styled[type]``
      const { result } = renderHook(() => useSectionWrapper(component))
      expect(result.current).toBe(null)
    })
  })

  it('StyledComponent を extend した場合も、元の要素で判定されること', () => {
    // eslint-disable-next-line smarthr/a11y-heading-in-sectioning-content -- 判定対象を作るためのテストコードのため
    const StyledSection = styled.section``
    const ExtendedSection = styled(StyledSection)``

    const { result } = renderHook(() => useSectionWrapper(ExtendedSection))
    expect(result.current).toBe(SectioningFragment)

    const StyledDiv = styled.div``
    const ExtendedDiv = styled(StyledDiv)``

    const { result: notSectioning } = renderHook(() => useSectionWrapper(ExtendedDiv))
    expect(notSectioning.current).toBe(null)
  })

  it('attrs・withConfig を挟んだ StyledComponent でも判定できること', () => {
    const { result: attrs } = renderHook(() => useSectionWrapper(styled.section.attrs({})``))
    expect(attrs.current).toBe(SectioningFragment)

    const { result: withConfig } = renderHook(() =>
      useSectionWrapper(styled.section.withConfig({ displayName: 'Foo' })``),
    )
    expect(withConfig.current).toBe(SectioningFragment)
  })

  it('コンポーネントを styled 化した場合は、要素名ではないため null が返ること', () => {
    const Component = () => null

    const { result } = renderHook(() => useSectionWrapper(styled(Component)``))
    expect(result.current).toBe(null)
  })

  it('StyledComponent ではないコンポーネントの場合、null が返ること', () => {
    const Component = () => null

    const { result } = renderHook(() => useSectionWrapper(Component))
    expect(result.current).toBe(null)
  })
})
