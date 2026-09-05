import { type ReactNode, useCallback, useState } from 'react'

import { useCallbackRefCleanupForReact18 } from '../../../hooks/client/useCallbackRefCleanupForReact18'

// HINT: prefix, suffixが存在せず、かつIcon,svg,img,Loaderのいずれかが単一でbodyに含まれるButtonかチェックしたい
// このSELECTORはbody内の対象を列挙する
// HINT: smarthr-ui-Icon-extendedはアイコン+α(例えば複数のアイコンをまとめて一つにしているなど)を表すclass
const ICON_SELECTOR = '.smarthr-ui-Icon, .smarthr-ui-Icon-extended, svg, img, .smarthr-ui-Loader'

// HINT: ActualButton/AnchorButtonInnerの双方から利用するため切り出している
export const useSquareDetection = ({
  prefix,
  suffix,
}: {
  prefix?: ReactNode
  suffix?: ReactNode
}) => {
  // HINT: squareは
  //  null: Buttonのレンダリング前
  //  boolean: レンダリング後
  const [square, setSquare] = useState<null | boolean>(null)

  // HINT: prefix, suffixはinner要素のmount/unmountを伴わずに変化しうるため、data-only-body属性として
  // DOMに反映し、MutationObserver自身にその変化も監視させることで、callback refのmount時チェックだけで完結させる
  const callbackRef = useCallbackRefCleanupForReact18(
    useCallback((node: HTMLElement | null) => {
      if (!node) return

      const checkSquare = () => {
        if (node.getAttribute('data-only-body') !== 'true') {
          setSquare(false)

          return
        }

        setSquare(node.children.length === 1 && node.children[0].matches(ICON_SELECTOR))
      }

      checkSquare()

      const observer = new MutationObserver(checkSquare)

      observer.observe(node, {
        childList: true,
        attributes: true,
        attributeFilter: ['data-only-body'],
      })

      return () => {
        observer.disconnect()
      }
    }, []),
  )

  return {
    square,
    callbackRef,
    dataOnlyBodyAttr: (!prefix && !suffix) || undefined,
  }
}
