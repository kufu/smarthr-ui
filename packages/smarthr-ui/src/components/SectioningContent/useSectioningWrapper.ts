import { type ComponentType, useMemo } from 'react'
import { isStyledComponent } from 'styled-components'

import { SectioningFragment } from './SectioningContent'

type ComponentType = string | ComponentType<any>

const SECTIONING_CONTENTS_REGEX = /^(article|aside|nav|section)$/

const isSectioningContent = (type: ComponentType) => {
  const type_ = isStyledComponent(type) ? type.target : type

  return typeof type_ === 'string' && SECTIONING_CONTENTS_REGEX.test(type_)
}

/** NOTE: Layout コンポーネントに変更がある場合、必ず [smarthr/a11y-heading-in-sectioning-content](https://github.com/kufu/eslint-plugin-smarthr/tree/main/rules/a11y-heading-in-sectioning-content) を見直すこと
 */
export const useSectionWrapper = (as: ComponentType) =>
  useMemo(() => (isSectioningContent(as) ? SectioningFragment : null), [as])
