'use client'

import {
  type FC,
  type ForwardedRef,
  type PropsWithChildren,
  type ReactNode,
  type Ref,
  forwardRef,
  memo,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react'
import { tv } from 'tailwind-variants'

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
  // HINT: h1のテキストをMutationObserverで監視するために内部でrefを保持しつつ、利用者のrefにも要素を渡す
  const innerRef = useRef<HTMLHeadingElement | null>(null)

  const titleFrame = useAnimationFrame()
  const latest = useLatest({ pageTitle, pageTitleSuffix, pseudoTitleId, titleFrame })

  const functions = useMemo(() => {
    const updateTitle = () => {
      const node = innerRef.current

      if (!node) {
        return
      }

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
    let observer: MutationObserver

    return {
      callbackRef: (node: HTMLHeadingElement | null) => {
        // TODO: useMergeRefsが実装された修正
        innerRef.current = node
        updateTitle()

        if (node) {
          observer ??= new MutationObserver(updateTitle)
          observer.observe(node, {
            characterData: true,
            childList: true,
            subtree: true,
          })
        } else {
          observer?.disconnect()
          latest.titleFrame.cancel()

          const pseudoTitle = document.getElementById(latest.pseudoTitleId)

          if (pseudoTitle) {
            pseudoTitle.remove()
          }
        }
      },
    }
  }, [latest])

  // TODO: useMergeRefsが実装された修正
  useImperativeHandle<HTMLHeadingElement | null, HTMLHeadingElement | null>(
    outerRef,
    () => innerRef.current,
    [],
  )

  return (
    <ActualHeading {...rest} headingRef={functions.callbackRef}>
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
      ref={headingRef}
      as="h1"
      size={size || STYLE_TYPE_MAP.screenTitle.size}
      className={actualClassName}
    >
      {children}
    </Component>
  )
}
