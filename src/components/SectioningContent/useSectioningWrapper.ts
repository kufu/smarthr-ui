import React, { useMemo } from 'react'

import { SectioningFragment } from '.'

type ComponentType = string | React.ComponentType<any>

const sectioningContents = ['article', 'aside', 'nav', 'section']

const isSectioningContent = (as: ComponentType) =>
  typeof as === 'string' && sectioningContents.includes(as)

export const useSectionWrapper = (as: ComponentType) =>
  useMemo(() => (isSectioningContent(as) ? SectioningFragment : React.Fragment), [as])
