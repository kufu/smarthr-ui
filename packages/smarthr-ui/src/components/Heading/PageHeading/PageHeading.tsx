'use client'

import { type PropsWithChildren, memo, useEffect, useId, useMemo } from 'react'
import innerText from 'react-innertext'
import { tv } from 'tailwind-variants'

import { STYLE_TYPE_MAP, Text, type TextProps } from '../../Text'
import { VisuallyHiddenText, visuallyHiddenTextClassNameGenerator } from '../../VisuallyHiddenText'

import type { ElementProps } from '../Heading'

export type Props = PropsWithChildren<{
  /**
   * テキストのサイズ
   *
   * @default 'XL'
   */
  size?: Extract<TextProps['size'], 'XXL' | 'XL' | 'L'>
  /** 視覚的に非表示にするフラグ */
  visuallyHidden?: boolean
  /** title要素の自動生成フラグ */
  autoPageTitle?: boolean
  /** title要素のprefix */
  pageTitle?: string
  /** title要素のsuffix */
  pageTitleSuffix?: string
}>

const classNameGenerator = tv({
  base: 'smarthr-ui-Heading smarthr-ui-PageHeading',
  variants: {
    visuallyHidden: {
      false: 'shr-m-[unset]',
    },
  },
  defaultVariants: {
    visuallyHidden: false,
  },
})

const PSEUDO_TITLE_CLASS_NAME = visuallyHiddenTextClassNameGenerator()

export const PageHeading = memo<Props & ElementProps>(
  ({
    size,
    className,
    visuallyHidden,
    autoPageTitle = true,
    pageTitleSuffix = 'SmartHR（スマートHR）',
    pageTitle,
    children,
    ...props
  }) => {
    const actualClassName = useMemo(
      () => classNameGenerator({ visuallyHidden, className }),
      [className, visuallyHidden],
    )
    const actualTypography = useMemo(() => {
      const defaultTypography = STYLE_TYPE_MAP.screenTitle

      if (size) {
        return { ...defaultTypography, size }
      }

      return defaultTypography
    }, [size])

    const pseudoTitleId = useId()
    const titleText = useMemo(
      () => (autoPageTitle ? `${pageTitle || innerText(children)}｜${pageTitleSuffix}` : ''),
      [children, pageTitle, pageTitleSuffix, autoPageTitle],
    )

    useEffect(() => {
      if (titleText) {
        // HINT: SPAで遷移する場合などの対策としてbody直下にaria-liveを仕込む
        // head内はスクリーンリーダーの変更検知のチェック対象外のため、title要素にaria-liveは設定しない
        const pseudoTitle: HTMLDivElement = (document.getElementById(pseudoTitleId) ||
          document.createElement('div')) as HTMLDivElement

        pseudoTitle.setAttribute('id', pseudoTitleId)
        pseudoTitle.setAttribute('class', PSEUDO_TITLE_CLASS_NAME)
        pseudoTitle.setAttribute('aria-live', 'polite')
        document.body.prepend(pseudoTitle)

        document.title = titleText
        requestAnimationFrame(() => {
          pseudoTitle.innerText = titleText
        })

        return () => {
          pseudoTitle.remove()
        }
      }

      return undefined
    }, [titleText, pseudoTitleId])

    const Component = visuallyHidden ? VisuallyHiddenText : Text

    return (
      <Component {...props} {...actualTypography} as="h1" className={actualClassName}>
        {children}
      </Component>
    )
  },
)
