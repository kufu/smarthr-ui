'use client'

import {
  type FC,
  type ForwardedRef,
  type PropsWithChildren,
  type ReactNode,
  type Ref,
  forwardRef,
  memo,
  useCallback,
  useId,
  useMemo,
} from 'react'
import { tv } from 'tailwind-variants'

import { useMergeRefs } from '../../../hooks/client/useMergeRefs'
import { useAnimationFrame } from '../../../hooks/useAnimationFrame'
import { useLatest } from '../../../hooks/useLatest'
import { IS_NEXT_JS } from '../../../libs/nextjs'
import { STYLE_TYPE_MAP, Text, type TextProps } from '../../Text'
import { VisuallyHiddenText, visuallyHiddenTextClassName } from '../../VisuallyHiddenText'

import type { ElementProps } from '../Heading'

export type BaseProps = PropsWithChildren<{
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
type Props = BaseProps & Omit<ElementProps, keyof BaseProps>

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

export const PageHeading = memo(
  forwardRef<HTMLHeadingElement, Props>(
    (
      {
        autoPageTitle = true,
        pageTitleSuffix = 'SmartHR（スマートHR）',
        pageTitle,
        size = 'XL',
        children,
        ...rest
      },
      ref,
    ) =>
      !IS_NEXT_JS && autoPageTitle ? (
        <AutoPageTitleHeading
          {...rest}
          outerRef={ref}
          pageTitleSuffix={pageTitleSuffix}
          pageTitle={pageTitle}
          size={size}
        >
          {children}
        </AutoPageTitleHeading>
      ) : (
        <ActualHeading {...rest} headingRef={ref} size={size}>
          {children}
        </ActualHeading>
      ),
  ),
)

const AutoPageTitleHeading: FC<
  Omit<Props, 'size' | 'autoPageTitle' | 'pageTitleSuffix' | 'ref'> & {
    size: TextProps['size']
    pageTitleSuffix: string
    outerRef?: ForwardedRef<HTMLHeadingElement>
  }
> = ({ pageTitleSuffix, pageTitle, outerRef, children, ...rest }) => {
  const pseudoTitleId = useId()
  const titleFrame = useAnimationFrame()
  const latest = useLatest({ pageTitle, pageTitleSuffix, pseudoTitleId, titleFrame })

  const callbackRef = useCallback(
    (node: HTMLHeadingElement | null) => {
      if (!node) {
        return
      }

      const updateTitle = () => {
        const title = latest.pageTitle || node.textContent || ''
        document.title = latest.pageTitleSuffix ? `${title}｜${latest.pageTitleSuffix}` : title

        // HINT: SPAで遷移する場合などの対策としてbody直下にaria-liveを仕込む
        // head内はスクリーンリーダーの変更検知のチェック対象外のため、title要素にaria-liveは設定しない
        const pseudoTitle: HTMLDivElement = (document.getElementById(latest.pseudoTitleId) ||
          document.createElement('div')) as HTMLDivElement

        pseudoTitle.setAttribute('id', latest.pseudoTitleId)
        pseudoTitle.setAttribute('class', visuallyHiddenTextClassName)
        pseudoTitle.setAttribute('aria-live', 'polite')
        document.body.prepend(pseudoTitle)

        latest.titleFrame.request(() => {
          pseudoTitle.textContent = document.title
        })
      }

      updateTitle()

      const observer = new MutationObserver(updateTitle)
      observer.observe(node, {
        characterData: true,
        childList: true,
        subtree: true,
      })

      // HINT: useMergeRefsはv18でもcallbackRefのcleanup関数に対応している
      // もしuseMergeRefsをなくす場合、react v18対応が不要になっているかどうか確認する
      return () => {
        observer.disconnect()
        latest.titleFrame.cancel()

        const pseudoTitle = document.getElementById(latest.pseudoTitleId)

        if (pseudoTitle) {
          pseudoTitle.remove()
        }
      }
    },
    [latest],
  )

  // HINT: useMergeRefsはv18でもcallbackRefのcleanup関数に対応している
  // もしuseMergeRefsをなくす場合、react v18対応が不要になっているかどうか確認する
  const mergedRef = useMergeRefs(callbackRef, outerRef)

  return (
    <ActualHeading {...rest} headingRef={mergedRef}>
      {children}
    </ActualHeading>
  )
}

type ActualHeadingProps = {
  visuallyHidden?: boolean
  size: TextProps['size']
  className?: string
  children: ReactNode
  headingRef?: Ref<HTMLHeadingElement>
} & Omit<ElementProps, 'size' | 'className' | 'visuallyHidden' | 'children' | 'ref'>

const ActualHeading: FC<ActualHeadingProps> = ({
  visuallyHidden,
  size,
  className,
  children,
  headingRef,
  ...rest
}) => {
  const actualClassName = useMemo(
    () => classNameGenerator({ visuallyHidden, className }),
    [className, visuallyHidden],
  )
  const Component = visuallyHidden ? VisuallyHiddenText : Text

  return (
    <Component
      {...rest}
      {...STYLE_TYPE_MAP.screenTitle}
      as="h1"
      ref={headingRef}
      size={size || STYLE_TYPE_MAP.screenTitle.size}
      className={actualClassName}
    >
      {children}
    </Component>
  )
}
