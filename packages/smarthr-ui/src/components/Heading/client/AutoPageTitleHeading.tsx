'use client'

import { type FC, type ForwardedRef, useCallback, useId } from 'react'

import { useAnimationFrame } from '../../../hooks/client/useAnimationFrame'
import { useMergeRefs } from '../../../hooks/client/useMergeRefs'
import { useLatest } from '../../../hooks/useLatest'
import { visuallyHiddenTextClassName } from '../../VisuallyHiddenText'
import { ActualHeading } from '../PageHeading'

import type { TextProps } from '../../Text'
import type { Props } from '../PageHeading'

export const AutoPageTitleHeading: FC<
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
