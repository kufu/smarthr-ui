export type Rect = {
  top: number
  right: number
  bottom: number
  left: number
}

export const PORTAL_CLASSNAME = '__dropdown--portal--root__'

export function createPortalElement(groupName: string = '', layer: number = 0) {
  const element = document.createElement('div')

  element.className = PORTAL_CLASSNAME
  element.dataset.dropdownLayer = `${layer}`
  element.dataset.dropdownGroupName = `${groupName}`
  return element
}

export function isElementInPortal(
  element: HTMLElement | null,
  groupName: string = '',
  layer: number = 0,
): boolean {
  if (!element) {
    return false
  }
  if (element.className !== PORTAL_CLASSNAME) {
    return isElementInPortal(element.parentElement, groupName, layer)
  }

  return (
    element.dataset?.dropdownGroupName === groupName &&
    parseInt(element.dataset?.dropdownLayer || '0', 10) >= layer
  )
}

export function getParentPortalElement(groupName: string = '', layer: number = 0) {
  if (layer > 0) {
    const e = document.querySelector(
      `.${PORTAL_CLASSNAME}[data-dropdown-group-name="${groupName}"][data-dropdown-layer="${
        layer - 1
      }"]`,
    )

    if (e) {
      return e
    }
  }

  return document.body
}

type Size = { width: number; height: number }
export type ContentBoxStyle = {
  top: string
  left: string
  maxHeight: string
}

export function getContentBoxStyle(
  triggerRect: Rect,
  contentSize: Size,
  windowSize: Size,
  scroll: {
    top: number
    left: number
  },
) {
  const contentBox: ContentBoxStyle = {
    top: 'auto',
    left: 'auto',
    maxHeight: '',
  }

  if (triggerRect.bottom + contentSize.height <= windowSize.height) {
    contentBox.top = `${scroll.top + triggerRect.bottom - 5}px`
  } else if (triggerRect.top - contentSize.height >= 0) {
    contentBox.top = `${scroll.top + triggerRect.top - contentSize.height + 5}px`
  } else {
    const padding = 10

    if (triggerRect.top + (triggerRect.bottom - triggerRect.top) / 2 < windowSize.height / 2) {
      contentBox.top = `${scroll.top + triggerRect.bottom - 5}px`
      contentBox.maxHeight = `${windowSize.height - triggerRect.bottom - padding}px`
    } else {
      contentBox.top = `${scroll.top + padding + 5}px`
      contentBox.maxHeight = `${triggerRect.top - padding}px`
    }
  }

  const triggerAlignCenter = triggerRect.left + (triggerRect.right - triggerRect.left) / 2

  if (triggerAlignCenter <= windowSize.width / 2) {
    contentBox.left = `${scroll.left + triggerRect.left - 5}px`
  } else {
    contentBox.left = `${scroll.left + triggerRect.right - contentSize.width + 5}px`
  }

  return contentBox
}
