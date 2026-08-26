'use client'

import { type FC, type ReactNode, memo, useEffect, useId, useMemo, useRef } from 'react'
import { tv } from 'tailwind-variants'

import { useObjectAttributes } from '../../hooks/useObjectAttributes'
import { Cluster } from '../Layout'
import { VisuallyHiddenText } from '../VisuallyHiddenText'

import { FormGroup, LabelBody, LabelCluster } from './FormGroup'
import { CHILDREN_WRAPPER_INPUT_SELECTOR, LABEL_TEXT_SELECTOR } from './constants'
import { classNameGenerator } from './style'
import { useAutoBindErrorInput } from './useAutoBindErrorInput'
import { useDescribedByIds } from './useDescribedByIds'

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
type LowerProps = Omit<Props, 'autoBindErrorInput'>

// HINT: useAutoBindErrorInputを呼ぶ/呼ばないでコンポーネントを分けている。
// FormGroup側で分岐すると、切り替え時にFormGroup配下のみが再マウントされ、
// ActualFieldsetのuseEffectがsetAttributeしたaria-label・aria-describedbyが
// 復元されなくなる。分岐を最上位に置くことで、再マウント時にそれらのuseEffectも
// 再実行されるようにしている。
export const Fieldset: FC<Props> = ({ autoBindErrorInput = true, ...rest }) => {
  const Component = autoBindErrorInput ? AutoBindErrorFieldset : ActualFieldset

  return <Component {...rest} />
}

const AutoBindErrorFieldset: FC<LowerProps> = (props) => {
  const { wrapperRef, visibleErrorMessages, ...rest } = useFieldsetProps(props)

  useAutoBindErrorInput({ wrapperRef, visibleErrorMessages })

  return <FormGroup {...rest} wrapperRef={wrapperRef} visibleErrorMessages={visibleErrorMessages} />
}

const ActualFieldset: FC<LowerProps> = (props) => {
  const actualProps = useFieldsetProps(props)

  return <FormGroup {...actualProps} />
}

const useFieldsetProps = ({
  legend: orgLegend,
  errorMessages: orgErrorMessages,
  helpMessage,
  exampleMessage,
  supplementaryMessage,
  innerMargin,
  className,
  ...rest
}: LowerProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null)
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

  const { describedbyIds, visibleErrorMessages, ...describedByIdsRest } = useDescribedByIds({
    wrapperRef,
    htmlFor: legend.htmlFor,
    errorMessages: orgErrorMessages,
    helpMessage,
    exampleMessage,
    supplementaryMessage,
  })

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

  return {
    ...rest,
    ...describedByIdsRest,
    visibleErrorMessages,
    as: 'fieldset',
    wrapperRef,
    label: legend,
    helpMessage,
    exampleMessage,
    supplementaryMessage,
    classNames,
    LabelComponent,
    innerMargin,
    'aria-describedby': describedbyIds || undefined,
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
      <LabelBody styleType={labelType} icon={labelIcon} statusLabels={statusLabels}>
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
