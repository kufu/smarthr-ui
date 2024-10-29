import { renderHook } from '@testing-library/react'
import React from 'react'
import styled from 'styled-components'

import { SectioningFragment } from './SectioningContent'
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

  it('sectioningContents に含まれない要素の場合、Fragment が返ること', () => {
    notSectioningContents.forEach((type) => {
      const { result } = renderHook(() => useSectionWrapper(type))
      expect(result.current).toBe(React.Fragment)
    })
  })

  it('sectioningContents に含まれない要素が StyledComponent の場合、Fragment が返ること', () => {
    notSectioningContents.forEach((type) => {
      const component = styled[type]``
      const { result } = renderHook(() => useSectionWrapper(component))
      expect(result.current).toBe(React.Fragment)
    })
  })
})
