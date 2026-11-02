'use client'

import {
  type FC,
  type PropsWithChildren,
  type ReactNode,
  type RefObject,
  useEffect,
  useMemo,
  useRef,
} from 'react'
import { CSSTransition } from 'react-transition-group'
import { tv } from 'tailwind-variants'

import { useEscapeCallbackRef } from '../../../../hooks/client/useEscapeCallbackRef'
import { useMergeRefs } from '../../../../hooks/client/useMergeRefs'
import { useLatest } from '../../../../hooks/useLatest'
import { Button } from '../../../Button'
import { FocusTrap } from '../../../Dialog'
import { FaXmarkIcon } from '../../../Icon'
import { Cluster } from '../../../Layout'
import { Portal } from '../../../Portal'
import { Section } from '../../../SectioningContent'

const classNameGenerator = tv({
  slots: {
    wrapper: [
      'shr-fixed shr-left-0 shr-top-0 shr-flex shr-h-full shr-w-full shr-flex-col shr-bg-white',
      'shr-translate-opacity shr-opacity-0 shr-duration-150',
      '[&&.shr-drawer-enter-active]:shr-opacity-100',
      '[&&.shr-drawer-enter-done]:shr-opacity-100',
      '[&&.shr-drawer-exit-active]:shr-opacity-0',
      '[&&.shr-drawer-exit-done]:shr-opacity-0',
    ],
    header: 'shr-border-b-shorthand shr-sticky shr-top-0 shr-px-0.75 shr-py-0.5',
  },
})

const CLASS_NAMES = (() => {
  // eslint-disable-next-line smarthr/best-practice-for-tailwind-variants -- module scopeで定義されており十分にmemo化されている。誤検知
  const { wrapper, header } = classNameGenerator()

  return {
    wrapper: wrapper(),
    header: header(),
  }
})()

let scrollPosition = 0

type Props = PropsWithChildren<{
  isOpen: boolean
  /** 閉じるボタンの左側に表示する見出しなどの内容 */
  heading: ReactNode
  /** 閉じるボタンの代替テキスト */
  closeLabel: ReactNode
  handleClose: () => void
  /** 閉じるアニメーションが終わり、中身がunmountされたときに呼ばれる */
  handleExited?: () => void
}>

/**
 * 画面全体を覆って表示するパネル。表示中は背面のスクロールを止め、フォーカスを内側に閉じ込め、Escapeキーで閉じる。
 */
export const Drawer: FC<Props> = ({ isOpen, handleClose, ...rest }) => {
  const domRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (isOpen) {
      scrollPosition = window.scrollY
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
      setTimeout(() => window.scrollTo(0, scrollPosition), 0)
    }
  }, [isOpen])

  const callbackRef = useEscapeCallbackRef(handleClose)

  return (
    <Portal>
      <CSSTransition
        nodeRef={domRef}
        in={isOpen}
        timeout={300}
        unmountOnExit
        classNames="shr-drawer"
      >
        <div ref={callbackRef} className="shr-fixed shr-z-overlap-base">
          <FocusTrap>
            <Content {...rest} domRef={domRef} handleClose={handleClose} />
          </FocusTrap>
        </div>
      </CSSTransition>
    </Portal>
  )
}

const Content: FC<Omit<Props, 'isOpen'> & { domRef: RefObject<HTMLElement> }> = ({
  domRef,
  heading,
  closeLabel,
  handleClose,
  handleExited,
  children,
}) => {
  const latest = useLatest({ handleExited })

  const functions = useMemo(
    () => ({
      // HINT: 閉じるアニメーションが終わるとCSSTransitionのchildrenはunmountされるため、
      // そのタイミングで呼び出し側に通知する
      callbackRef: () => () => {
        latest.handleExited?.()
      },
    }),
    [latest],
  )

  const mergedRef = useMergeRefs(functions.callbackRef, domRef)

  return (
    // eslint-disable-next-line smarthr/a11y-heading-in-sectioning-content -- 見出しは heading 経由で呼び出し側から渡される
    <Section ref={mergedRef} role="dialog" className={CLASS_NAMES.wrapper} aria-modal="true">
      <div className={CLASS_NAMES.header}>
        <Cluster justify="space-between" align="center">
          {heading}
          <Button size="S" onClick={handleClose}>
            <FaXmarkIcon alt={closeLabel} />
          </Button>
        </Cluster>
      </div>
      {children}
    </Section>
  )
}
