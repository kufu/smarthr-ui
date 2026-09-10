import { type FC, type ReactNode, memo, useCallback, useId, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { useObjectAttributes } from '../../hooks/useObjectAttributes'
import { Cluster } from '../Layout'
import { VisuallyHiddenText } from '../VisuallyHiddenText'

import { FormGroup, LabelBody, LabelCluster } from './FormGroup'
import { CHILDREN_WRAPPER_INPUT_SELECTOR, LABEL_TEXT_SELECTOR } from './constants'
import { classNameGenerator } from './style'

import type { CommonProps, LabelComponentProps, ObjectLabelType } from './type'

const legendObjectConverter = (legend: ReactNode) => ({ text: legend })

const fieldsetClassNameGenerator = tv({
  extend: classNameGenerator,
  variants: {
    // TODO: innerMarginが未指定、初期値の場合、childrenの上部の余白を広げることで
    // FormControlとの差をわかりやすくしている
    // 微妙な方法ではあるので、必要に応じてinnerMarginではない属性を用意する
    // https://kufuinc.slack.com/archives/CGC58MW01/p1737944965871159?thread_ts=1737541173.404369&cid=CGC58MW01
    withDefaultMargin: {
      true: {
        childrenWrapper: '[:not([hidden])_~_&&&]:shr-mt-0.5',
      },
    },
  },
})

type Props = CommonProps & {
  legend: ReactNode | Omit<ObjectLabelType, 'htmlFor'>
  /** `true` のとき、文字色を `TEXT_DISABLED` にする */
  disabled?: boolean
}

export const Fieldset: FC<Props> = (props) => {
  const actualProps = useFieldsetProps(props)

  return <FormGroup {...actualProps} />
}

const useFieldsetProps = ({ legend: orgLegend, innerMargin, className, ...rest }: Props) => {
  const baseId = useId()

  const classNames = useMemo(() => {
    const generators = fieldsetClassNameGenerator()

    return {
      wrapper: generators.wrapper({ className }),
      childrenWrapper: generators.childrenWrapper({ withDefaultMargin: innerMargin === undefined }),
    }
  }, [innerMargin, className])

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
  const callbackRef = useCallback((node: HTMLElement | null) => {
    if (!node) return

    const labelTextEl = node.querySelector(LABEL_TEXT_SELECTOR)

    if (!labelTextEl) return

    // HINT: legend変更のたびにaria-labelへ古いlegend文言が蓄積しないよう、
    // 初回に確定したアクセシブルネームをinput要素ごとに保持しておく
    const baseAccessibleNames = new WeakMap<HTMLInputElement, string>()

    const updateAriaLabels = () => {
      const labelText = labelTextEl.textContent || ''
      if (!labelText) return

      const inputs = node.querySelectorAll<HTMLInputElement>(CHILDREN_WRAPPER_INPUT_SELECTOR)
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

  return {
    ...rest,
    as: 'fieldset',
    callbackRef,
    label: legend,
    classNames,
    LabelComponent,
    innerMargin,
  }
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
      <LabelBody statusLabels={statusLabels} styleType={labelType} icon={labelIcon}>
        {label}
      </LabelBody>
    )
    // HINT: legendはfieldsetのchildrenの先頭に設置することがmarkupとして求められる
    // そのためUIの調整を可能にするため、常にvisuallyHiddenでfieldsetのchildrenの先頭に埋め込む
    const legend = <VisuallyHiddenText as="legend">{body}</VisuallyHiddenText>

    if (unrecommendedHideLabel) {
      return legend
    }

    // HINT: 先述のfieldsetのmarkupの制約のため、UI上に表示されるlegendのdummyにはaria-hiddenを設定し
    // UI・スクリーンリーダーともに１つだけ設定されているかのように見せかける
    const renderedLegend = <LabelCluster aria-hidden="true">{body}</LabelCluster>

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
