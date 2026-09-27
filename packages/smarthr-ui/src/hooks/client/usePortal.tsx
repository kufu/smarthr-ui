import {
  type ComponentPropsWithoutRef,
  type ElementType,
  type FC,
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react'
import { createPortal } from 'react-dom'

import { useEnhancedEffect } from './useEnhancedEffect'

type ParentContextValue = {
  seqs: number[]
}

const ParentContext = createContext<ParentContextValue>({
  seqs: [],
})

let portalSeq = 0

type PortalProps = Omit<
  ComponentPropsWithoutRef<'div'>,
  'data-portal-child-of' | 'data-portal-current-seq'
> & {
  as?: ElementType
}

export const Portal: FC<PortalProps> = ({ as: Component = 'div', children, ...rest }) => {
  const [currentSeq] = useState(() => ++portalSeq)
  const [mounted, setMounted] = useState(false)
  const parent = useContext(ParentContext)

  const calculatedSeqs = useMemo(() => {
    const parentSeqs = parent.seqs.concat(currentSeq)

    return {
      parentSeqs,
      portalChildOf: parentSeqs.join(','),
    }
  }, [currentSeq, parent.seqs])

  useEnhancedEffect(() => {
    // Next.jsのhydration error回避のため、マウント後にのみportalを描画する
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return createPortal(
    <ParentContext.Provider value={{ seqs: calculatedSeqs.parentSeqs }}>
      <Component
        {...rest}
        data-portal-current-seq={currentSeq}
        data-portal-child-of={calculatedSeqs.portalChildOf}
      >
        {children}
      </Component>
    </ParentContext.Provider>,
    document.body,
  )
}

/**
 * targetが、nodeの属するポータル系列(node自身が生成したポータル、またはその祖先ポータル)の
 * 子孫かどうかを判定する。nodeにはPortalの中身に含まれる任意の要素を渡せば良い。
 */
export function isChildPortal(target: HTMLElement | SVGElement | null, node: HTMLElement): boolean {
  const seq = node.closest<HTMLElement>('[data-portal-current-seq]')?.dataset.portalCurrentSeq

  if (seq === undefined) {
    return false
  }

  return _isDescendantOfSeq(target, Number(seq))
}

function _isDescendantOfSeq(element: HTMLElement | SVGElement | null, seq: number): boolean {
  if (!element) return false

  const childOf = element.dataset?.portalChildOf
  const seqRegex = new RegExp(`(^|,)${seq}(,|$)`)
  const includesSeq = childOf !== undefined && seqRegex.test(childOf)

  return includesSeq || _isDescendantOfSeq(element.parentElement, seq)
}
