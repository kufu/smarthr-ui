import { type RefObject, useEffect } from 'react'

import { CHILDREN_WRAPPER_INPUT_SELECTOR } from './constants'

/**
 * エラーがある場合に、子のinput要素へaria-invalidを付与するフック。
 *
 * HINT: このフックを呼ぶ/呼ばないでコンポーネントを分けているため、propsによる分岐は行わない。
 * 詳細な理由はFormControl・Fieldsetの分岐箇所のコメントを参照。
 */
export const useAutoBindErrorInput = ({
  wrapperRef,
  visibleErrorMessages,
}: {
  wrapperRef: RefObject<HTMLDivElement>
  visibleErrorMessages: boolean
}) => {
  useEffect(() => {
    if (!wrapperRef.current) {
      return
    }

    const input = wrapperRef.current.querySelector(CHILDREN_WRAPPER_INPUT_SELECTOR)

    if (input) {
      if (visibleErrorMessages) {
        input.setAttribute('aria-invalid', 'true')
      } else {
        input.removeAttribute('aria-invalid')
      }
    }
  }, [visibleErrorMessages, wrapperRef])
}
