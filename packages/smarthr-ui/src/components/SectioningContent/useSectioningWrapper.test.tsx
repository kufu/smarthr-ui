import { renderHook } from '@testing-library/react'

import { SectioningFragment } from './client'
import { useSectionWrapper } from './useSectioningWrapper'

import type { ComponentType } from 'react'

// HINT: styled-componentsで作ったコンポーネントは、extend・attrs・withConfigを挟んでも
// 対象の要素名をtargetに保持する。styled-componentsに依存せず、同じ形のコンポーネントで検証する
const createStyledLike = (target: string | ComponentType) => Object.assign(() => null, { target })

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
      const { result } = renderHook(() => useSectionWrapper(createStyledLike(type)))
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
      const { result } = renderHook(() => useSectionWrapper(createStyledLike(type)))
      expect(result.current).toBe(null)
    })
  })

  it('コンポーネントを styled 化した場合は、要素名ではないため null が返ること', () => {
    const Component = () => null

    const { result } = renderHook(() => useSectionWrapper(createStyledLike(Component)))
    expect(result.current).toBe(null)
  })

  it('StyledComponent ではないコンポーネントの場合、null が返ること', () => {
    const Component = () => null

    const { result } = renderHook(() => useSectionWrapper(Component))
    expect(result.current).toBe(null)
  })
})
