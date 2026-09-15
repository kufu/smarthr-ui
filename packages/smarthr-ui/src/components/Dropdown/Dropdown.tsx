'use client'

import {
  type FC,
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

import { type Rect, getFirstTabbable, isEventFromChild } from './dropdownHelper'

type Props = PropsWithChildren<{
  onOpen?: () => void
  onClose?: () => void
}>

type DropdownContextType = {
  active: boolean
  triggerRect: Rect
  triggerElementRef: MutableRefObject<HTMLDivElement | null>
  handleClickTrigger: (rect: Rect) => void
  handleDelegateClickCloser: () => void
  DropdownContentRoot: FC<{ children: ReactNode }>
  contentId: string
}

const initialRect = { top: 0, right: 0, bottom: 0, left: 0 }

export const DropdownContext = createContext<DropdownContextType>({
  active: false,
  triggerRect: initialRect,
  triggerElementRef: createRef(),
  handleClickTrigger: () => {
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
      handleClickTrigger: (rect: Rect) => {
        if (latest.active) {
          setActive(false)
          actualClose()
        } else {
          setActive(true)
          setTriggerRect(rect)

          if (latest.onOpen) {
            latest.openFrame.request(() => latest.onOpen?.())
          }
        }
      },
      handleDelegateClickCloser: () => {
        setActive(false)
        actualClose()

        // return focus to the Trigger
        getFirstTabbable(triggerElementRef)?.focus()
      },
    }
  }, [latest])

  useEffect(
    () => () => {
      latest.openFrame.cancel()
      latest.closeFrame.cancel()
    },
    [latest],
  )

  useEffect(() => {
    if (!active) return

    const handleClickBody = (e: any) => {
      // ignore events from events within DropdownTrigger and DropdownContent
      if (
        latest.active &&
        !isEventFromChild(e, triggerElementRef.current) &&
        !latest.isChildPortal(e.target)
      ) {
        setActive(false)
        functions.actualClose()
      }
    }
    const updateTriggerRect = () => {
      if (triggerElementRef.current) {
        setTriggerRect(triggerElementRef.current.getBoundingClientRect())
      }
    }
    const listnerOption = { passive: true }

    document.body.addEventListener('click', handleClickBody, false)
    window.addEventListener('scroll', updateTriggerRect, listnerOption)
    window.addEventListener('resize', updateTriggerRect, listnerOption)

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
          handleClickTrigger: functions.handleClickTrigger,
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
