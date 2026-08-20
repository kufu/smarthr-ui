import { useEffect, useId, useRef } from 'react'

import { useObjectAttributes } from '../../hooks/useObjectAttributes'
import {
  ActualFormControl,
  type ObjectLabelType,
  SMARTHR_UI_INPUT_SELECTOR,
  SMARTHR_UI_LABEL_TEXT_SELECTOR,
  labelObjectConverter,
} from '../FormControl'

import type { ComponentProps, FC, ReactNode } from 'react'

type FormControlType = ComponentProps<typeof ActualFormControl>

export const Fieldset: FC<
  Omit<FormControlType, 'as' | 'label' | 'inputWrapperRef'> & {
    legend: Omit<Exclude<FormControlType['label'], ReactNode>, 'htmlFor'> | ReactNode
  }
> = ({ legend: orgLegend, ...rest }) => {
  const legend = useObjectAttributes<ReactNode | ObjectLabelType, ObjectLabelType>(
    orgLegend,
    labelObjectConverter,
  )
  const baseId = useId()
  const inputWrapperRef = useRef<HTMLDivElement>(null)

  // HINT: Fieldset内の可視ラベルが無いinputに、legend文言をアクセシブルネームに追加する
  // https://waic.jp/translations/WCAG21/Understanding/label-in-name.html
  useEffect(() => {
    if (!inputWrapperRef.current) return

    // HINT: unrecommendedHideLabelがfalseの場合、同じテキストを持つ要素が2つレンダリングされるが
    // どちらも同一文字列のため、1つ目を取得すれば十分
    const labelTextEl = inputWrapperRef.current.parentElement?.querySelector(
      `.${SMARTHR_UI_LABEL_TEXT_SELECTOR}`,
    )
    if (!labelTextEl) return

    const updateAriaLabels = () => {
      const labelText = labelTextEl.textContent || ''
      if (!labelText) return

      const inputs =
        inputWrapperRef.current!.querySelectorAll<HTMLInputElement>(SMARTHR_UI_INPUT_SELECTOR)
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

  return (
    <ActualFormControl
      {...rest}
      label={{
        ...legend,
        htmlFor: legend.htmlFor || `${baseId}-htmlFor`,
        id: legend.id || `${baseId}-legend`,
      }}
      as="fieldset"
      inputWrapperRef={inputWrapperRef}
    />
  )
}
