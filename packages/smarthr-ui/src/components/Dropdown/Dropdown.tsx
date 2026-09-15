'use client'

import {
  type FC,
  type MouseEvent,
  type MutableRefObject,
  type PropsWithChildren,
  type ReactNode,
  createContext,
  createRef,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'

import { useAnimationFrame } from '../../hooks/client/useAnimationFrame'
import { usePortal } from '../../hooks/client/usePortal'
import { useLatest } from '../../hooks/useLatest'
import { tabbable } from '../../libs/tabbable'

import type { Rect } from './dropdownHelper'

type Props = PropsWithChildren<{
  onOpen?: () => void
  onClose?: () => void
}>

type DropdownContextType = {
  active: boolean
  triggerRect: Rect
  triggerElementRef: MutableRefObject<HTMLDivElement | null>
  handleDelegateClickTrigger: (e: MouseEvent<HTMLElement>) => void
  handleDelegateClickCloser: () => void
  DropdownContentRoot: FC<{ children: ReactNode }>
  contentId: string
}

const initialRect = { top: 0, right: 0, bottom: 0, left: 0 }

export const DropdownContext = createContext<DropdownContextType>({
  active: false,
  triggerRect: initialRect,
  triggerElementRef: createRef(),
  handleDelegateClickTrigger: () => {
    /* noop */
  },
  handleDelegateClickCloser: () => {
    /* noop */
  },
  DropdownContentRoot: () => null,
  contentId: '',
})

export const Dropdown: FC<Props> = ({ onOpen, onClose, children }) => {
  const [active, setActive] = useState(false)
  const [triggerRect, setTriggerRect] = useState<Rect>(initialRect)

  const contentId = useId()
  const { createPortal, isChildPortal, PortalParentProvider } = usePortal({
    rootId: contentId,
  })

  const triggerElementRef = useRef<HTMLDivElement>(null)
  const openFrame = useAnimationFrame()
  const closeFrame = useAnimationFrame()

  const latest = useLatest({
    active,
    isChildPortal,
    onOpen,
    onClose,
    createPortal,
    openFrame,
    closeFrame,
  })

  const functions = useMemo(() => {
    // This is the root container of a dropdown content located in outside the DOM tree
    const DropdownContentRoot: FC<{ children: ReactNode }> = (props) =>
      latest.active ? latest.createPortal(props.children) : null
    DropdownContentRoot.displayName = 'DropdownContentRoot'
    const actualClose = () => {
      if (latest.onClose) {
        latest.closeFrame.request(() => latest.onClose?.())
      }
    }

    return {
      DropdownContentRoot,
      actualClose,
      handleDelegateClickTrigger: (e: MouseEvent<HTMLElement>) => {
        const button = (e.target as HTMLElement).closest('button')

        // 引き金となる要素が disabled な場合、処理を差し込む必要がない
        if (!button || button.disabled || button.getAttribute('aria-disabled') === 'true') {
          return
        } else if (latest.active) {
          setActive(false)
          actualClose()
        } else {
          setActive(true)
          setTriggerRect(button.getBoundingClientRect())

          if (latest.onOpen) {
            latest.openFrame.request(() => latest.onOpen?.())
          }
        }
      },
      handleDelegateClickCloser: () => {
        setActive(false)
        actualClose()

        // return focus to the Trigger
        tabbable(triggerElementRef.current!)[0]?.focus()
      },
    }
  }, [latest])

  // TODO: コンポーネントをFragmentでラップし、callbackRefとして設定するように修正
  useEffect(
    () => () => {
      latest.openFrame.cancel()
      latest.closeFrame.cancel()
    },
    [latest],
  )

  // TODO: コンポーネントをFragmentでラップし、layoutEffectRefとして設定するように修正
  useEffect(() => {
    if (!active) return

    const handleClickBody = (e: any) => {
      if (!latest.active || !triggerElementRef.current) {
        return
      }

      // ignore events from events within DropdownTrigger and DropdownContent
      const isClickedInTrigger = e.composedPath().includes(triggerElementRef.current)

      if (!isClickedInTrigger && !latest.isChildPortal(e.target)) {
        setActive(false)
        functions.actualClose()
      }
    }
    const updateTriggerRect = () => {
      if (triggerElementRef.current) {
        setTriggerRect(triggerElementRef.current.getBoundingClientRect())
      }
    }
    const listenerOption = { passive: true }

    document.body.addEventListener('click', handleClickBody, false)
    window.addEventListener('scroll', updateTriggerRect, listenerOption)
    window.addEventListener('resize', updateTriggerRect, listenerOption)

    return () => {
      document.body.removeEventListener('click', handleClickBody, false)
      window.removeEventListener('scroll', updateTriggerRect)
      window.removeEventListener('resize', updateTriggerRect)
    }
  }, [active, functions, latest])

  return (
    <PortalParentProvider>
      <DropdownContext.Provider
        value={{
          active,
          triggerRect,
          triggerElementRef,
          handleDelegateClickTrigger: functions.handleDelegateClickTrigger,
          handleDelegateClickCloser: functions.handleDelegateClickCloser,
          DropdownContentRoot: functions.DropdownContentRoot,
          contentId,
        }}
      >
        {children}
      </DropdownContext.Provider>
    </PortalParentProvider>
  )
}
