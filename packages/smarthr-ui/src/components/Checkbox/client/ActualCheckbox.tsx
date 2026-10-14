'use client'

import { useMergeRefs } from '../../../hooks/client/useMergeRefs'

import type { SHRComponentPropsWithRef } from '../../../types'
import type { FC } from 'react'

type Props = SHRComponentPropsWithRef<
  'input',
  {
    /** `true` のとき、チェック状態を `mixed` にする */
    mixed?: boolean
    /** チェックボックスにエラーがあるかどうか */
    error?: boolean
  },
  { omit: 'children' }
>

const callbackRef = (node: HTMLInputElement | null) => {
  if (!node) {
    return
  }

  // mixedはchecked===trueの場合の見た目を変えるフラグのため、
  // 実DOMのcheckedプロパティとdata-mixed属性の両方を見て判定する
  const action = () => {
    node.indeterminate = node.checked && node.getAttribute('data-mixed') === 'true'
  }

  action()

  // ユーザー操作でcheckedが変わった場合も再評価する
  node.addEventListener('change', action)

  // data-checkedはchecked(controlled prop)が変化したことをMutationObserverに伝えるトリガーとしてのみ使う
  // (判定自体はnode.checkedを見るため、data-checkedの値そのものは判定に使わない)
  const observer = new MutationObserver(action)

  observer.observe(node, {
    attributes: true,
    attributeFilter: ['data-checked', 'data-mixed'],
  })

  return () => {
    node.removeEventListener('change', action)
    observer.disconnect()
  }
}

export const ActualCheckbox: FC<Props> = ({ ref, checked, mixed, error, ...rest }) => {
  const mergedRef = useMergeRefs(callbackRef, ref)
  const errorAttr = error || undefined

  return (
    <input
      {...rest}
      ref={mergedRef}
      type="checkbox"
      checked={checked}
      aria-invalid={errorAttr}
      data-smarthr-ui-input-error={errorAttr}
      data-smarthr-ui-input="true"
      data-checked={checked || undefined}
      data-mixed={mixed || undefined}
    />
  )
}
