'use client'

import {
  type CSSProperties,
  type FC,
  type MouseEvent,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { tv } from 'tailwind-variants'

import { useMergeRefs } from '../../../hooks/client/useMergeRefs'
import { useLatest } from '../../../hooks/useLatest'
import { Aside } from '../../SectioningContent'
import { drawerSize } from '../drawerSize'

import { DrawerContext, useDrawerContextValue } from './DrawerContext'
import { DRAWER_TRANSITION_DURATION, DRAWER_TRANSITION_EASING } from './drawerTransition'

import type { ExtendElementPropsWithRef } from '../../../types'
import type { InlineDrawerSize } from '../drawerSize'

type Props = ExtendElementPropsWithRef<
  'aside',
  {
    /** パネル（aside）の id。トリガーの aria-controls に同じ値を指定する。閉じている間も aside は DOM に残る */
    id: string
    /** 開いているかどうか */
    isOpen: boolean
    /** パネルの幅。既定は 'S' */
    size?: InlineDrawerSize
    /** DrawerHeader の閉じるボタン押下時 */
    onClickClose: (e?: MouseEvent<HTMLButtonElement>) => void
    /** aria-label。未指定なら DrawerHeader の title がアクセシブル名になる */
    ariaLabel?: string
    /** aria-labelledby。未指定なら DrawerHeader の title がアクセシブル名になる */
    ariaLabelledby?: string
  },
  { omit: 'style' | 'hidden' | 'inert' | 'aria-label' | 'aria-labelledby' }
>

type Phase = 'hidden' | 'opening' | 'open' | 'closing'

const EXPANDED_STYLE: CSSProperties = {
  transitionDuration: `${DRAWER_TRANSITION_DURATION}ms`,
  transitionTimingFunction: DRAWER_TRANSITION_EASING,
}
const COLLAPSED_STYLE: CSSProperties = { ...EXPANDED_STYLE, width: 0 }

// CSS の @starting-style だけで幅を遷移させる案は、isOpen=true の初回表示でも 0 から開いてしまうため採らない
const PHASE_ATTRIBUTES = {
  hidden: { hidden: true, inert: true, style: COLLAPSED_STYLE },
  opening: { hidden: false, inert: false, style: COLLAPSED_STYLE },
  open: { hidden: false, inert: false, style: EXPANDED_STYLE },
  closing: { hidden: false, inert: true, style: COLLAPSED_STYLE },
} as const satisfies Record<Phase, { hidden: boolean; inert: boolean; style: CSSProperties }>

const classNameGenerator = tv({
  slots: {
    wrapper: [
      'smarthr-ui-InlineDrawer',
      'shr-group/inlineDrawer shr-flex shr-max-w-full shr-shrink-0 shr-overflow-clip shr-bg-white',
      'first:shr-justify-end',
      'shr-transition-[width] motion-reduce:shr-transition-none',
      '[&[hidden]]:shr-hidden',
    ],
    inner: [
      'smarthr-ui-InlineDrawer-inner',
      'shr-sticky shr-top-0 shr-box-border shr-flex shr-h-full shr-max-h-[100dvh] shr-shrink-0 shr-flex-col',
      'group-first/inlineDrawer:shr-border-r-shorthand group-last/inlineDrawer:shr-border-l-shorthand',
      'group-first/inlineDrawer:contrast-more:shr-border-high-contrast group-last/inlineDrawer:contrast-more:shr-border-high-contrast',
    ],
  },
  variants: {
    size: {
      S: { wrapper: drawerSize.S, inner: drawerSize.S },
      M: { wrapper: drawerSize.M, inner: drawerSize.M },
      L: { wrapper: drawerSize.L, inner: drawerSize.L },
    } satisfies Record<InlineDrawerSize, { wrapper: string; inner: string }>,
  },
})

export const InlineDrawer: FC<Props> = ({
  id,
  isOpen,
  size = 'S',
  onClickClose,
  ariaLabel,
  ariaLabelledby,
  className,
  children,
  ref,
  ...rest
}) => {
  const asideRef = useRef<HTMLElement>(null)
  const returnFocusRef = useRef<HTMLElement | null>(null)
  const [phase, setPhase] = useState<Phase>(isOpen ? 'open' : 'hidden')
  const latest = useLatest({ id, phase })

  const { contextValue, resolvedLabelledby } = useDrawerContextValue({
    isOpen,
    onClickClose,
    ariaLabel,
    ariaLabelledby,
  })

  useLayoutEffect(() => {
    const panel = asideRef.current

    if (!panel) return

    if (isOpen) {
      if (latest.phase === 'open') return

      const active = document.activeElement

      returnFocusRef.current =
        active instanceof HTMLElement && active !== document.body && !panel.contains(active)
          ? active
          : null

      if (latest.phase === 'closing') {
        setPhase('open')

        return
      }

      setPhase('opening')

      let rafId = requestAnimationFrame(() => {
        rafId = requestAnimationFrame(() => setPhase('open'))
      })

      return () => cancelAnimationFrame(rafId)
    }

    if (latest.phase === 'hidden') return

    if (panel.contains(document.activeElement)) {
      const triggers = Array.from(document.querySelectorAll<HTMLElement>('[aria-controls]')).filter(
        (el) => el.getAttribute('aria-controls')!.split(/\s+/).includes(latest.id),
      )

      for (const target of [returnFocusRef.current, ...triggers]) {
        if (target?.isConnected && !panel.contains(target)) {
          target.focus()

          if (document.activeElement === target) break
        }
      }
    }

    returnFocusRef.current = null
    setPhase('closing')

    const timerId = setTimeout(() => setPhase('hidden'), DRAWER_TRANSITION_DURATION)

    return () => clearTimeout(timerId)
  }, [isOpen, latest])

  const classNames = useMemo(() => {
    const { wrapper, inner } = classNameGenerator()

    return { wrapper: wrapper({ size, className }), inner: inner({ size }) }
  }, [size, className])

  const mergedRef = useMergeRefs(asideRef, ref)

  return (
    // eslint-disable-next-line smarthr/a11y-heading-in-sectioning-content
    <Aside
      {...rest}
      {...PHASE_ATTRIBUTES[phase]}
      ref={mergedRef}
      id={id}
      className={classNames.wrapper}
      aria-label={ariaLabel}
      aria-labelledby={resolvedLabelledby}
    >
      <div className={classNames.inner}>
        <DrawerContext.Provider value={contextValue}>{children}</DrawerContext.Provider>
      </div>
    </Aside>
  )
}
