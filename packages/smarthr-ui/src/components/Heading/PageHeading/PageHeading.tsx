'use client'

import { type PropsWithChildren, memo, useEffect, useId, useMemo, useRef } from 'react'
import { tv } from 'tailwind-variants'

import { IS_NEXT_JS } from '../../../libs/nextjs'
import { STYLE_TYPE_MAP, Text, type TextProps } from '../../Text'
import { VisuallyHiddenText, visuallyHiddenTextClassName } from '../../VisuallyHiddenText'

import type { ElementProps } from '../Heading'

export type AbstractProps = PropsWithChildren<{
  /**
   * テキストのサイズ
   *
   * @default 'XL'
   */
  size?: Extract<TextProps['size'], 'XXL' | 'XL' | 'L'>
  /** 視覚的に非表示にするフラグ */
  visuallyHidden?: boolean
  /**
   * title要素の自動生成フラグ
   *
   * Next.js 環境ではこの値にかかわらずtitleは自動生成されません。metadataなどの方法を利用してください。
   */
  autoPageTitle?: boolean
  /** title要素のprefix */
  pageTitle?: string
  /** title要素のsuffix */
  pageTitleSuffix?: string
}>
type Props = AbstractProps & Omit<ElementProps, keyof AbstractProps>

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

export const PageHeading = memo<Props>(
  ({
    size,
    className,
    visuallyHidden,
    autoPageTitle = true,
    pageTitleSuffix,
    pageTitle,
    children,
    ...rest
  }) => {
    const actualClassName = useMemo(
      () => classNameGenerator({ visuallyHidden, className }),
      [className, visuallyHidden],
    )

    if (IS_NEXT_JS || !autoPageTitle) {
      const Component = visuallyHidden ? VisuallyHiddenText : Text

      return (
        <Component
          {...rest}
          {...STYLE_TYPE_MAP.screenTitle}
          size={size || STYLE_TYPE_MAP.screenTitle.size}
          as="h1"
          className={actualClassName}
        >
          {children}
        </Component>
      )
    }

    return (
      <AutoPageTitleHeading
        {...rest}
        size={size || STYLE_TYPE_MAP.screenTitle.size}
        visuallyHidden={visuallyHidden}
        pageTitleSuffix={pageTitleSuffix}
        pageTitle={pageTitle}
        className={actualClassName}
      >
        {children}
      </AutoPageTitleHeading>
    )
  },
)

export const AutoPageTitleHeading = memo<
  Omit<Props, 'size' | 'autoPageTitle'> & {
    size: TextProps['size']
  }
>(({ size, className, visuallyHidden, pageTitleSuffix, pageTitle, children, ...rest }) => {
  const pseudoTitleId = useId()
  const ref = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const h1 = ref.current
    if (!h1) return

    const updateTitle = () => {
      document.title = `${pageTitle || h1.textContent || ''}｜${pageTitleSuffix || 'SmartHR（スマートHR）'}`

      // HINT: SPAで遷移する場合などの対策としてbody直下にaria-liveを仕込む
      // head内はスクリーンリーダーの変更検知のチェック対象外のため、title要素にaria-liveは設定しない
      const pseudoTitle: HTMLDivElement = (document.getElementById(pseudoTitleId) ||
        document.createElement('div')) as HTMLDivElement

      pseudoTitle.setAttribute('id', pseudoTitleId)
      pseudoTitle.setAttribute('class', visuallyHiddenTextClassName)
      pseudoTitle.setAttribute('aria-live', 'polite')
      document.body.prepend(pseudoTitle)

      requestAnimationFrame(() => {
        pseudoTitle.textContent = document.title
      })
    }

    updateTitle()

    const observer = new MutationObserver(updateTitle)
    observer.observe(h1, {
      characterData: true,
      childList: true,
      subtree: true,
    })

    return () => {
      observer.disconnect()
      const pseudoTitle = document.getElementById(pseudoTitleId)
      if (pseudoTitle) {
        pseudoTitle.remove()
      }
    }
  }, [pageTitle, pageTitleSuffix, pseudoTitleId, visuallyHidden])

  const Component = visuallyHidden ? VisuallyHiddenText : Text

  return (
    <Component
      {...rest}
      {...STYLE_TYPE_MAP.screenTitle}
      size={size}
      as="h1"
      className={className}
      ref={ref}
    >
      {children}
    </Component>
  )
})
