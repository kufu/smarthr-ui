import { type ComponentType, useMemo } from 'react'

import { SectioningFragment } from '../components'

type AsType = string | ComponentType<any>

const SECTIONING_CONTENTS_REGEX = /^(article|aside|nav|section)$/

const isSectioningContent = (as: AsType) => {
  // HINT: styled-componentsは対象の要素をtargetに保持している。
  // isStyledComponentで判定するとstyled-componentsのimportが必要になり、
  // v5がreact-server条件でTypeErrorになるためRSCで動作しなくなる。
  // targetが文字列かどうかだけで判定すればimportが不要になる
  const target = (as as { target?: unknown }).target
  const type_ = typeof target === 'string' ? target : as

  return typeof type_ === 'string' && SECTIONING_CONTENTS_REGEX.test(type_)
}

/** NOTE: Layout コンポーネントに変更がある場合、必ず [smarthr/a11y-heading-in-sectioning-content](https://github.com/kufu/eslint-plugin-smarthr/tree/main/rules/a11y-heading-in-sectioning-content) を見直すこと
 */
export const useSectionWrapper = (as: AsType) =>
  useMemo(() => (isSectioningContent(as) ? SectioningFragment : null), [as])
