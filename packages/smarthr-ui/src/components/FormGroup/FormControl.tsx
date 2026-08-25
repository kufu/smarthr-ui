'use client'

import {
  type ComponentProps,
  type FC,
  type ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'

import { useObjectAttributes } from '../../hooks/useObjectAttributes'

import { CHILDREN_WRAPPER_INPUT_SELECTOR, FormGroup } from './FormGroup'

import type { ObjectLabelType } from './type'

const labelObjectConverter = (label: ReactNode) => ({ text: label })

export const FormControl: FC<
  Omit<ComponentProps<typeof FormGroup>, 'as' | 'disabled' | 'wrapperRef'>
> = ({ label: orgLabel, ...rest }) => {
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

  return <FormGroup {...rest} wrapperRef={wrapperRef} label={label} />
}
