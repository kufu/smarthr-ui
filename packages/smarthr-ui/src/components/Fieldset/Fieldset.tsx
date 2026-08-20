import { useCallback, useId } from 'react'

import { useMergeRefs } from '../../hooks/useMergeRefs'
import { useObjectAttributes } from '../../hooks/useObjectAttributes'
import {
  ActualFormControl,
  type FormControl,
  type ObjectLabelType,
  SMARTHR_UI_INPUT_SELECTOR,
  SMARTHR_UI_LABEL_TEXT_SELECTOR,
  labelObjectConverter,
} from '../FormControl'

import type { ComponentProps, FC, ReactNode } from 'react'

type FormControlType = ComponentProps<typeof FormControl>

export const Fieldset: FC<
  Omit<FormControlType, 'label'> & {
    /** `true` のとき、文字色を `TEXT_DISABLED` にする */
    disabled?: boolean
    legend: Omit<Exclude<FormControlType['label'], ReactNode>, 'htmlFor'> | ReactNode
  }
> = ({ legend: orgLegend, innerMargin, ...rest }) => {
  const legend = useObjectAttributes<ReactNode | ObjectLabelType, ObjectLabelType>(
    orgLegend,
    labelObjectConverter,
  )
  const baseId = useId()

  // HINT: Fieldset内の可視ラベルが無いinputに、legend文言をアクセシブルネームに追加する
  // https://waic.jp/translations/WCAG21/Understanding/label-in-name.html
  const callbackRef = useCallback((node: HTMLDivElement | null) => {
    if (!node) return

    // HINT: unrecommendedHideLabelがfalseの場合、同じテキストを持つ要素が2つレンダリングされるが
    // どちらも同一文字列のため、1つ目を取得すれば十分
    const labelTextEl = node.parentElement?.querySelector(`.${SMARTHR_UI_LABEL_TEXT_SELECTOR}`)
    if (!labelTextEl) return

    const updateAriaLabels = () => {
      const labelText = labelTextEl.textContent || ''
      if (!labelText) return

      const inputs = node.querySelectorAll<HTMLInputElement>(SMARTHR_UI_INPUT_SELECTOR)
      if (!inputs.length) return

      inputs.forEach((input: HTMLInputElement) => {
        const accessibleName =
          input.getAttribute('aria-label') ||
          (input.labels?.[0]?.classList.contains('smarthr-ui-VisuallyHiddenText')
            ? input.labels[0].textContent
            : '')

        if (
          accessibleName &&
          !accessibleName.includes(labelText) &&
          !labelText.includes(accessibleName)
        ) {
          input.setAttribute('aria-label', `${accessibleName} ${labelText}`)
        }
      })
    }

    // 初回実行
    updateAriaLabels()

    // label要素の変更を監視
    const observer = new MutationObserver(updateAriaLabels)
    observer.observe(labelTextEl, {
      childList: true,
      subtree: true,
      characterData: true,
    })

    return () => observer.disconnect()
  }, [])

  // TODO: React v18にはcallback refのcleanup関数が実装されていないため、useMergeRefsを呼び出すことで
  // 擬似的にcleanupを実施する。v18を切れるタイミングになったらuseMergeRefsは不要になる
  const mergedRef = useMergeRefs(callbackRef)

  return (
    <ActualFormControl
      {...rest}
      innerMargin={innerMargin}
      label={{
        ...legend,
        htmlFor: legend.htmlFor || `${baseId}-htmlFor`,
        id: legend.id || `${baseId}-legend`,
      }}
      as="fieldset"
      inputWrapperRef={mergedRef}
      // TODO: innerMarginが未指定、初期値の場合、childrenの上部の余白を広げることで
      // FormControlとの差をわかりやすくしている
      // 微妙な方法ではあるので、必要に応じてinnerMarginではない属性を用意する
      // https://kufuinc.slack.com/archives/CGC58MW01/p1737944965871159?thread_ts=1737541173.404369&cid=CGC58MW01
      childrenWrapperClassName={
        innerMargin === undefined ? '[:not([hidden])_~_&&&]:shr-mt-0.5' : undefined
      }
    />
  )
}
