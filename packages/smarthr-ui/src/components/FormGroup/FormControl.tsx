'use client'

import { type FC, type ReactNode, memo, useEffect, useId, useMemo, useRef, useState } from 'react'

import { useObjectAttributes } from '../../hooks/useObjectAttributes'
import { Cluster } from '../Layout'
import { VisuallyHiddenText } from '../VisuallyHiddenText'

import { FormGroup, LabelBody, LabelCluster } from './FormGroup'
import { CHILDREN_WRAPPER_INPUT_SELECTOR } from './constants'
import { classNameGenerator } from './style'
import { useAutoBindErrorInput } from './useAutoBindErrorInput'
import { useDescribedByIds } from './useDescribedByIds'

import type { CommonProps, LabelComponentProps, ObjectLabelType } from './type'

const labelObjectConverter = (label: ReactNode) => ({ text: label })

type Props = CommonProps & {
  label: ReactNode | ObjectLabelType
}
type LowerProps = Omit<Props, 'autoBindErrorInput'>

// HINT: useAutoBindErrorInputを呼ぶ/呼ばないでコンポーネントを分けている。
// FormGroup側で分岐すると、切り替え時にFormGroup配下のみが再マウントされ、
// ActualFormControlのuseEffectがsetAttributeしたid・aria-describedbyが
// 復元されなくなる。分岐を最上位に置くことで、再マウント時にそれらのuseEffectも
// 再実行されるようにしている。
export const FormControl: FC<Props> = ({ autoBindErrorInput = true, ...rest }) => {
  const Component = autoBindErrorInput ? AutoBindErrorFormControl : ActualFormControl

  return <Component {...rest} />
}

const AutoBindErrorFormControl: FC<LowerProps> = (props) => {
  const { wrapperRef, visibleErrorMessages, ...rest } = useFormControlProps(props)

  useAutoBindErrorInput({ wrapperRef, visibleErrorMessages })

  return <FormGroup {...rest} wrapperRef={wrapperRef} visibleErrorMessages={visibleErrorMessages} />
}

const ActualFormControl: FC<LowerProps> = (props) => {
  const actualProps = useFormControlProps(props)

  return <FormGroup {...actualProps} />
}

const useFormControlProps = ({
  label: orgLabel,
  errorMessages: orgErrorMessages,
  helpMessage,
  exampleMessage,
  supplementaryMessage,
  className,
  ...rest
}: LowerProps) => {
  const classNames = useMemo(() => {
    const generators = classNameGenerator()

    return {
      wrapper: generators.wrapper({ className }),
      childrenWrapper: generators.childrenWrapper(),
    }
  }, [className])

  const wrapperRef = useRef<HTMLDivElement>(null)
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

  const calculatedDescribedByIds = useDescribedByIds({
    wrapperRef,
    htmlFor: label.htmlFor,
    errorMessages: orgErrorMessages,
    helpMessage,
    exampleMessage,
    supplementaryMessage,
  })

  useEffect(() => {
    if (
      !wrapperRef.current ||
      // HINT: 対象idを持つ要素が既に存在する場合、何もしない
      document.getElementById(label.htmlFor)
    ) {
      return
    }

    const input = wrapperRef.current.querySelector(CHILDREN_WRAPPER_INPUT_SELECTOR)

    if (!input) {
      return
    }

    const inputId = input.getAttribute('id')

    if (inputId) {
      setChildInputId(inputId)
    } else {
      input.setAttribute('id', label.htmlFor)
    }

    if (input instanceof HTMLInputElement && input.type === 'file') {
      const inputLabelledByIds = input.getAttribute('aria-labelledby')

      if (inputLabelledByIds) {
        // InputFileの場合はlabel要素の可視ラベルをアクセシブルネームに含める
        input.setAttribute('aria-labelledby', `${inputLabelledByIds} ${label.id}`)
      }
    }
  }, [label.htmlFor, label.id])

  return {
    ...rest,
    ...calculatedDescribedByIds,
    wrapperRef,
    label,
    helpMessage,
    exampleMessage,
    supplementaryMessage,
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
      <LabelBody styleType={labelType} icon={labelIcon} statusLabels={statusLabels}>
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

    const renderedLabel = <LabelCluster {...attrs}>{body}</LabelCluster>

    if (subActionArea) {
      return (
        <Cluster justify="space-between">
          {renderedLabel}
          <div className="shr-grow">{subActionArea}</div>
        </Cluster>
      )
    }

    return renderedLabel
  },
)
