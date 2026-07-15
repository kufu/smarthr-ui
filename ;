/* eslint-disable */
'use client'

import { FC, KeyboardEventHandler, useEffect, useId, useRef, useState } from 'react'

import * as Intercom from '@intercom/messenger-js-sdk'

type Position = {
  x: number
  y: number
}

export type IntercomWidget = {
  appId: string
}

export const IntercomWidget: FC<IntercomWidget> = (props) => {
  const { appId } = props

  const id = useId()
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const dragging = useRef<boolean>(false)
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 })

  useEffect(() => {
    Intercom.Intercom({
      app_id: appId,
      hide_default_launcher: true,
      custom_launcher_selector: `#${id}`,
    })
  }, [id])

  useEffect(() => {
    document.addEventListener('mousedown', (e) => {
      if (
        e.target instanceof HTMLElement &&
        buttonRef.current &&
        buttonRef.current.contains(e.target)
      ) {
        dragging.current = true
      }
    })

    document.addEventListener('mousemove', (e) => {
      if (!dragging.current) {
        return
      }

      setPosition((prev) => ({
        x: prev.x + e.movementX,
        y: prev.y + e.movementY,
      }))
    })

    document.addEventListener('mouseup', (e) => {
      if (dragging.current) {
        dragging.current = false

        setPosition((prev) => {
          if (prev.x < window.innerWidth / 2 && prev.y < window.innerHeight / 2) {
            Intercom.update({ alignment: 'left' })
            return { x: 0, y: 0 }
          }
          if (prev.x > window.innerWidth / 2 && prev.y < window.innerHeight / 2) {
            Intercom.update({ alignment: 'right' })
            return { x: window.innerWidth - 48, y: 0 }
          }
          if (prev.x < window.innerWidth / 2 && prev.y > window.innerHeight / 2) {
            Intercom.update({ alignment: 'left' })
            return { x: 0, y: window.innerHeight - 48 }
          }
          if (prev.x > window.innerWidth / 2 && prev.y > window.innerHeight / 2) {
            Intercom.update({ alignment: 'right' })
            return { x: window.innerWidth - 48, y: window.innerHeight - 48 }
          }
          return { x: 0, y: 0 }
        })
      }
    })
  }, [])

  const handleKeyDown: KeyboardEventHandler = (e) => {
    const DELTA = 30
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault()
        setPosition((prev) => ({ x: prev.x, y: prev.y - DELTA }))
        break
      case 'ArrowDown':
        e.preventDefault()
        setPosition((prev) => ({ x: prev.x, y: prev.y + DELTA }))
        break
      case 'ArrowRight':
        e.preventDefault()
        setPosition((prev) => ({ x: prev.x + DELTA, y: prev.y }))
        break
      case 'ArrowLeft':
        e.preventDefault()
        setPosition((prev) => ({ x: prev.x - DELTA, y: prev.y }))
        break
    }
  }

  return (
    <button
      id={id}
      ref={buttonRef}
      className="shr-layer-4 shr-h-[48px] shr-w-[48px] shr-cursor-grab shr-rounded-full shr-border-0 shr-bg-main shr-text-white shr-shadow-layer-4 hover:shr-bg-main-darken"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
      onKeyDown={handleKeyDown}
    >
      hello
    </button>
  )
}
