'use client'

import { useAnimationFrame } from '../../../hooks/client/useAnimationFrame'
import { useLayoutEffectRef } from '../../../hooks/client/useLayoutEffectRef'
import { useMergeRefs } from '../../../hooks/client/useMergeRefs'

import type { ExtendElementPropsWithRef } from '../../../types'
import type { FC } from 'react'

type Props = ExtendElementPropsWithRef<
  'input',
  {
    /** `true` のとき、チェック状態を `mixed` にする */
    mixed?: boolean
    /** チェックボックスにエラーがあるかどうか */
    error?: boolean
  },
  { omit: 'children' }
>

const syncMixedState = (node: HTMLInputElement) => {
  // mixedはchecked===trueの場合の見た目を変えるフラグのため、
  // 実DOMのcheckedプロパティとdata-mixed属性の両方を見て判定する
  node.indeterminate = node.checked && node.getAttribute('data-mixed') === 'true'
}

const callbackRef = (node: HTMLInputElement | null) => {
  if (!node) {
    return
  }

  const action = () => syncMixedState(node)

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
  const resetFrame = useAnimationFrame()
  const resetCallbackRef = useLayoutEffectRef<HTMLInputElement>(
    (node) => {
      if (!node || !mixed) {
        return
      }

      const root = node.getRootNode()
      const handleReset = (event: Event) => {
        // form属性などで所属フォームが変わるため、イベント発生時のformを参照する。
        if (event.target === node.form) {
          // リセット後のcheckedを取得する。リセットがキャンセルされた場合、checkedは変化しない。
          resetFrame.request(() => syncMixedState(node))
        }
      }

      root.addEventListener('reset', handleReset, true)

      return () => {
        root.removeEventListener('reset', handleReset, true)
        resetFrame.cancel()
      }
    },
    [mixed, resetFrame],
  )
  const mergedRef = useMergeRefs(callbackRef, resetCallbackRef, ref)
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
