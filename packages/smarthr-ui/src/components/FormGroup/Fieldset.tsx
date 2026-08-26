'use client'

import { type FC, type ReactNode, memo, useEffect, useId, useRef } from 'react'

import { useObjectAttributes } from '../../hooks/useObjectAttributes'
import { Cluster } from '../Layout'
import { Text } from '../Text'
import { VisuallyHiddenText } from '../VisuallyHiddenText'

import { FormGroup } from './FormGroup'
import { CHILDREN_WRAPPER_INPUT_SELECTOR, LABEL_TEXT_SELECTOR } from './constants'

import type { CommonProps, LabelComponentProps, ObjectLabelType } from './type'

const legendObjectConverter = (legend: ReactNode) => ({ text: legend })

export const Fieldset: FC<
  CommonProps & {
    legend: ReactNode | Omit<ObjectLabelType, 'htmlFor'>
    /** `true` のとき、文字色を `TEXT_DISABLED` にする */
    disabled?: boolean
  }
> = ({ legend: orgLegend, innerMargin, ...rest }) => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const baseId = useId()

  const baseLegend = useObjectAttributes<ReactNode | ObjectLabelType, ObjectLabelType>(
    orgLegend,
    legendObjectConverter,
  )
  const legend = {
    ...baseLegend,
    // HINT: Fieldsetなので本質的にhtmlForは不要なのだがhtmlForを使って
    // 最初のinputと各種ヒントをaria-describedbyでつなげているため必要
    htmlFor: `${baseId}-htmlFor`,
    id: baseLegend.id || `${baseId}-legend`,
  }

  // HINT: Fieldset内の可視ラベルが無いinputに、legend文言をアクセシブルネームに追加する
  // https://waic.jp/translations/WCAG21/Understanding/label-in-name.html
  useEffect(() => {
    if (!wrapperRef.current) return

    const labelTextEl = wrapperRef.current.querySelector(LABEL_TEXT_SELECTOR)

    if (!labelTextEl) return

    // HINT: legend変更のたびにaria-labelへ古いlegend文言が蓄積しないよう、
    // 初回に確定したアクセシブルネームをinput要素ごとに保持しておく
    const baseAccessibleNames = new WeakMap<HTMLInputElement, string>()

    const updateAriaLabels = () => {
      const labelText = labelTextEl.textContent || ''
      if (!labelText) return

      const inputs = wrapperRef.current?.querySelectorAll<HTMLInputElement>(
        CHILDREN_WRAPPER_INPUT_SELECTOR,
      )
      if (!inputs?.length) return

      inputs.forEach((input: HTMLInputElement) => {
        let accessibleName = baseAccessibleNames.get(input)

        if (accessibleName === undefined) {
          accessibleName =
            input.getAttribute('aria-label') ||
            (input.labels?.[0]?.classList.contains('smarthr-ui-VisuallyHiddenText')
              ? input.labels[0].textContent || ''
              : '')
          baseAccessibleNames.set(input, accessibleName)
        }

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
    <FormGroup
      {...rest}
      as="fieldset"
      wrapperRef={wrapperRef}
      label={legend}
      LabelComponent={LabelComponent}
      innerMargin={innerMargin}
      fieldsetWithDefaultMargin={innerMargin === undefined}
    />
  )
}

const LabelComponent = memo<LabelComponentProps>(
  ({
    unrecommendedHideLabel,
    labelType = 'blockTitle',
    label,
    labelIcon,
    subActionArea,
    statusLabels,
  }) => {
    const body = (
      <>
        <Text styleType={labelType} icon={labelIcon}>
          <span className="smarthr-ui-FormControl-labelText">{label}</span>
        </Text>
        {statusLabels.length > 0 && (
          <Cluster gap={0.25} as="span">
            {statusLabels}
          </Cluster>
        )}
      </>
    )
    const legend = <VisuallyHiddenText as="legend">{body}</VisuallyHiddenText>

    if (unrecommendedHideLabel) {
      return legend
    }

    const renderedLegend = (
      <Cluster aria-hidden="true" align="center" className="smarthr-ui-FormControl-label">
        {body}
      </Cluster>
    )

    if (subActionArea) {
      return (
        <>
          {legend}
          <Cluster justify="space-between">
            {renderedLegend}
            <div className="shr-grow">{subActionArea}</div>
          </Cluster>
        </>
      )
    }

    return (
      <>
        {legend}
        {renderedLegend}
      </>
    )
  },
)
