import { type ComponentType, useMemo } from 'react'
// HINT: styled-componentsがRSCに対応するのはv6.3.0以降。peerは^5.0.1のため、
// モジュールスコープでcreateContextを呼びガードが無いバージョンが解決されうる。
// react-server条件でimportするとTypeErrorになるため、このモジュールを使うコンポーネントは
// 'use client'を外せない（Layout配下・Panelが該当）。
import { isStyledComponent } from 'styled-components'

import { SectioningFragment } from '../components'

type AsType = string | ComponentType<any>

const SECTIONING_CONTENTS_REGEX = /^(article|aside|nav|section)$/

const isSectioningContent = (as: AsType) => {
  const type_ = isStyledComponent(as) ? as.target : as

  return typeof type_ === 'string' && SECTIONING_CONTENTS_REGEX.test(type_)
}

/** NOTE: Layout コンポーネントに変更がある場合、必ず [smarthr/a11y-heading-in-sectioning-content](https://github.com/kufu/eslint-plugin-smarthr/tree/main/rules/a11y-heading-in-sectioning-content) を見直すこと
 */
export const useSectionWrapper = (as: AsType) =>
  useMemo(() => (isSectioningContent(as) ? SectioningFragment : null), [as])
