import React, { useMemo } from 'react'

import { SectioningFragment } from '.'

type ComponentType = string | React.ComponentType<any>

const sectioningContents = ['article', 'aside', 'nav', 'section']

const isSectioningContent = (as: ComponentType) =>
  typeof as === 'string' && sectioningContents.includes(as)

/** NOTE: Layout コンポーネントに変更がある場合、必ず [smarthr/a11y-heading-in-sectioning-content](https://github.com/kufu/eslint-plugin-smarthr/tree/main/rules/a11y-heading-in-sectioning-content) を見直すこと
 */
export const useSectionWrapper = (as: ComponentType) =>
  useMemo(() => (isSectioningContent(as) ? SectioningFragment : React.Fragment), [as])
