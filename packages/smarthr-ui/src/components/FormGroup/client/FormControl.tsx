'use client'

import { type FC, type ReactNode, memo, useId, useMemo, useRef, useState } from 'react'

import { useLayoutEffectRef } from '../../../hooks/client/useLayoutEffectRef'
import { useObjectAttributes } from '../../../hooks/useObjectAttributes'
import { Cluster } from '../../Layout'
import { VisuallyHiddenText } from '../../VisuallyHiddenText'

import { FormGroup, LabelBody, LabelCluster } from './FormGroup'
import { CHILDREN_WRAPPER_INPUT_SELECTOR } from './constants'
import { classNameGenerator } from './style'

import type { CommonProps, LabelComponentProps, ObjectLabelType } from './type'

const labelObjectConverter = (label: ReactNode) => ({ text: label })

type Props = CommonProps & {
  label: ReactNode | ObjectLabelType
}

export const FormControl: FC<Props> = (props) => {
  const actualProps = useFormControlProps(props)

  return <FormGroup {...actualProps} />
}

const useFormControlProps = ({ label: orgLabel, className, ...rest }: Props) => {
  const classNames = useMemo(() => {
    const generators = classNameGenerator()

    return {
      wrapper: generators.wrapper({ className }),
      childrenWrapper: generators.childrenWrapper(),
    }
  }, [className])

  const baseId = useId()
  const [childInputId, setChildInputId] = useState<string>('')

  const baseLabel = useObjectAttributes<ReactNode | ObjectLabelType, ObjectLabelType>(
    orgLabel,
    labelObjectConverter,
  )
  const label = {
    ...baseLabel,
    htmlFor: baseLabel.htmlFor || childInputId || `${baseId}-htmlFor`,
    id: baseLabel.id || `${baseId}-label`,
  }

  // HINT: 自分がsetAttributeで設定したid/aria-labelledbyトークンを記憶しておく。
  // 利用者がInputに直接指定したid・aria-labelledbyと、自分由来のものを区別するために使う
  const managedInputIdRef = useRef(label.htmlFor)
  const managedLabelIdRef = useRef(label.id)

  const layoutEffectRef = useLayoutEffectRef(
    (node: HTMLElement | null) => {
      if (!node) {
        return
      }

      const input = node.querySelector(CHILDREN_WRAPPER_INPUT_SELECTOR)

      if (!input) {
        return
      }

      if (label.htmlFor) {
        const currentInputId = input.getAttribute('id')

        if (currentInputId && currentInputId !== managedInputIdRef.current) {
          // HINT: 自分が過去に設定したid以外（=外部由来のid）の場合はそれを尊重する
          setChildInputId(currentInputId)
        } else {
          const existingElement = document.getElementById(label.htmlFor)

          // HINT: 対象idを持つ別の要素が既に存在する場合、何もしない
          if (!existingElement || existingElement === input) {
            if (currentInputId !== label.htmlFor) {
              input.setAttribute('id', label.htmlFor)
            }
            managedInputIdRef.current = label.htmlFor
          }
        }
      }

      if (input instanceof HTMLInputElement && input.type === 'file') {
        const inputLabelledByIds = input.getAttribute('aria-labelledby')

        if (inputLabelledByIds) {
          const tokens = inputLabelledByIds.split(' ')
          // HINT: 自分が過去に追加したid以外（=外部由来のid）だけを残す
          const externalTokens = tokens.filter((token) => token !== managedLabelIdRef.current)
          // InputFileの場合はlabel要素の可視ラベルをアクセシブルネームに含める
          const nextTokens = label.id ? [...externalTokens, label.id] : externalTokens
          const nextValue = nextTokens.join(' ')

          if (nextValue !== inputLabelledByIds) {
            input.setAttribute('aria-labelledby', nextValue)
          }

          managedLabelIdRef.current = label.id ?? ''
        }
      }
    },
    [label.htmlFor, label.id],
  )

  return {
    ...rest,
    outerRef: layoutEffectRef,
    label,
    classNames,
    LabelComponent,
  }
}

const LabelComponent = memo<LabelComponentProps>(
  ({
    managedHtmlFor,
    managedLabelId,
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

    const attrs = {
      as: 'label' as const,
      htmlFor: managedHtmlFor,
      id: managedLabelId,
    }

    if (unrecommendedHideLabel) {
      return <VisuallyHiddenText {...attrs}>{body}</VisuallyHiddenText>
    }

    // HINT: subActionAreaの有無でlabelの親を変えると、Stack直下に来た場合にalign-items:stretchで
    // labelが全幅に広がり、テキストが無い部分をクリックしても入力要素にフォーカスが移ってしまう
    // そのためsubActionAreaが無い場合も横方向のClusterで包み、labelの幅を内容分に保つ
    return (
      <Cluster justify="space-between">
        <LabelCluster {...attrs}>{body}</LabelCluster>
        {subActionArea && <div className="shr-grow">{subActionArea}</div>}
      </Cluster>
    )
  },
)
