'use client'

import { useMergeRefs } from '../../../hooks/client/useMergeRefs'

import type { ComponentPropsWithoutRef, FC, Ref } from 'react'

export type Props = ComponentPropsWithoutRef<'input'> & {
  checkboxRef?: Ref<HTMLInputElement>
  /** `true` のとき、チェック状態を `mixed` にする */
  mixed?: boolean
  /** チェックボックスにエラーがあるかどうか */
  error?: boolean
}

const callbackRef = (node: HTMLInputElement | null) => {
  if (!node) {
    return
  }

  // checkedはcontrolled propとしてinput.checkedプロパティにのみ反映され、
  // HTML属性としては反映されないため、data-checked属性で代替判定する
  const action = () => {
    node.indeterminate =
      node.getAttribute('data-checked') === 'true' && node.getAttribute('data-mixed') === 'true'
  }

  action()

  const observer = new MutationObserver(action)

  observer.observe(node, {
    attributes: true,
    attributeFilter: ['data-checked', 'data-mixed'],
  })

  return () => {
    observer.disconnect()
  }
}

export const ActualCheckbox: FC<Props> = ({ checkboxRef, checked, mixed, error, ...rest }) => {
  const mergedRef = useMergeRefs(callbackRef, checkboxRef)

  return (
    <input
      {...rest}
      ref={mergedRef}
      type="checkbox"
      checked={checked}
      aria-invalid={error || undefined}
      data-smarthr-ui-input="true"
      // checkedはDOM属性ではなくプロパティとしてのみ反映されるため、data-checkedをMutationObserverで監視
      data-checked={checked || undefined}
      data-mixed={mixed || undefined}
    />
  )
}
