import { CHILDREN_WRAPPER_INPUT_SELECTOR } from './constants'

export const autoBindErrorCallbackRef = (node: HTMLElement | null) => {
  if (!node) {
    return
  }

  const action = () => {
    const bindErrorAttr = node.getAttribute('data-auto-bind-error-input')

    // HINT: そもそも属性がない場合、入力要素にaria-invalid属性を自動的にon/offする処理をしない
    if (!bindErrorAttr) {
      return
    }

    const input = node.querySelector(CHILDREN_WRAPPER_INPUT_SELECTOR)

    if (input) {
      if (bindErrorAttr === 'true') {
        input.setAttribute('aria-invalid', 'true')
      } else {
        input.removeAttribute('aria-invalid')
      }
    }
  }

  action()

  const observer = new MutationObserver(action)
  observer.observe(node, {
    attributes: true,
    attributeFilter: ['data-auto-bind-error-input'],
  })

  return () => {
    observer.disconnect()
  }
}
