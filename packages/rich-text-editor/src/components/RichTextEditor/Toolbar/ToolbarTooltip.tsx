'use client'

import { type FC, type ReactNode, memo, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useEnvironment } from 'smarthr-ui'
import { tv } from 'tailwind-variants'

import { useLatest } from '../../../hooks/useLatest'
import { useIsApplePlatform } from '../hooks/useIsApplePlatform'

import { formatShortcutTokens } from './shortcutKeys'

const GAP = 4

const classNameGenerator = tv({
  slots: {
    wrapper: 'shr-inline-block',
    // absolute だと body に position が付いたページで基準がずれる
    tooltip: [
      'shr-pointer-events-none shr-fixed shr-z-overlap',
      'shr-flex shr-flex-col shr-items-center shr-gap-0.5',
      'shr-whitespace-nowrap shr-rounded-m shr-bg-black shr-px-0.5 shr-py-0.5 shr-text-sm shr-text-white',
    ],
    // 既定の line-height だと行ボックスに内包された余白の半分がラベル文字の上に乗り、
    // キーの箱（leading-none で文字に密着）との対比で上の余白だけ広く見える。
    // 行ボックスを文字に密着させて上下の余白を揃える。
    label: 'shr-leading-none',
    // ショートカットのキーを並べる行。ラベルの下に2行目として配置する
    shortcutRow: 'shr-flex shr-items-center shr-gap-0.25',
    // ツールチップ本体（黒背景）よりわずかに明るい半透明の箱。白文字とのコントラストは
    // 黒背景上で実効的に #333333 相当になり約12:1 確保できる
    // border-style を明示しないと、Tailwind preflight の border-style: solid リセットが
    // 効いていないこのリポジトリでは border-width が 0 に落ちる（shr-border だけでは効かない）
    // 枠線を /50 にしているのは、/30 だと黒背景に対して約 2.5:1 で WCAG 1.4.11 の目安
    // 3:1 を下回るため。/50 なら約 5.3:1 になる
    // block のままだと、行ボックスよりフォントの content area が高いぶん文字が上に寄る。
    // flex で中央揃えし、最小幅と高さを揃えてキーごとの箱の大きさのばらつきも抑える。
    key: 'shr-inline-flex shr-h-[1.5em] shr-min-w-[1.5em] shr-items-center shr-justify-center shr-rounded-s shr-border shr-border-solid shr-border-white/50 shr-bg-white/20 shr-px-0.25 shr-text-xs shr-font-bold shr-leading-none shr-text-white',
  },
  variants: {
    // ツールチップはトリガーより横に広い。編集領域の端にあるトリガーで中央揃えにすると
    // はみ出した側がウィンドウ外へ出て読めなくなるため、端では内側へ向けて伸ばす。
    align: {
      center: { tooltip: 'shr--translate-x-1/2' },
      start: {},
      end: { tooltip: 'shr--translate-x-full' },
    },
  },
})

type TooltipAlign = 'center' | 'start' | 'end'

const ALIGN_TO_LEFT: Record<TooltipAlign, (rect: DOMRect) => number> = {
  center: (rect) => rect.left + rect.width / 2,
  start: (rect) => rect.left,
  end: (rect) => rect.right,
}

const CLASS_NAMES = (() => {
  const { wrapper, tooltip, label, shortcutRow, key } = classNameGenerator()

  return {
    wrapper: wrapper(),
    tooltip: {
      center: tooltip({ align: 'center' }),
      start: tooltip({ align: 'start' }),
      end: tooltip({ align: 'end' }),
    },
    label: label(),
    shortcutRow: shortcutRow(),
    key: key(),
  }
})()

type Props = {
  label: string
  /** Tiptap 表記のショートカット（例: `Mod-B`）。未指定ならラベルのみ表示する */
  shortcut?: string
  /** true の間はホバー・フォーカスしてもツールチップを出さない */
  suppressed?: boolean
  /** トリガーに対する横位置。編集領域の端に置くトリガーでは内側へ寄せる */
  align?: TooltipAlign
  children: ReactNode
}

export const ToolbarTooltip: FC<Props> = memo(
  ({ label, shortcut, suppressed, align = 'center', children }) => {
    const isApple = useIsApplePlatform()
    const { mobile } = useEnvironment()
    // position と分けているのは、クリップされて見えないあいだも監視を続けるため。
    // position で監視を止めると、スクロールを戻しても復帰できない
    const [isActive, setIsActive] = useState(false)
    const [position, setPosition] = useState<{ top: number; left: number } | null>(null)
    const wrapperRef = useRef<HTMLSpanElement>(null)
    const isHovered = useRef(false)
    const isClipped = useRef(false)
    const tokens = shortcut ? formatShortcutTokens(shortcut, isApple) : []

    const latest = useLatest({ align, mobile })

    const functions = useMemo(() => {
      const syncPosition = () => {
        const el = wrapperRef.current

        if (!el) return

        // イベントだけだと pointerleave が届かないときに出たまま残り、:hover だけだと
        // jsdom が常に true を返すため検証できない
        const active =
          !latest.mobile &&
          ((isHovered.current && el.matches(':hover')) || el.contains(document.activeElement))

        setIsActive(active)

        if (!active || isClipped.current) {
          setPosition(null)

          return
        }

        const rect = el.getBoundingClientRect()
        const next = {
          top: rect.bottom + GAP,
          left: ALIGN_TO_LEFT[latest.align](rect),
        }

        setPosition((current) =>
          current && current.top === next.top && current.left === next.left ? current : next,
        )
      }

      return {
        syncPosition,
        handleDelegatePointerEnter: () => {
          isHovered.current = true
          syncPosition()
        },
        handleDelegatePointerLeave: () => {
          isHovered.current = false
          syncPosition()
        },
        handleDelegateFocusChange: syncPosition,
      }
    }, [latest])

    // scroll と resize の購読では足りない。プログラムからのスクロールで
    // pointerout が届かず、ツールチップが取り残されることがある。
    // 交差を監視しているのは、ポータルへ出すと段の overflow が効かなくなるため。
    // root 未指定で足りる（交差の計算は祖先のクリップ矩形も含む）
    useEffect(() => {
      const el = wrapperRef.current

      if (!isActive || !el) return

      if (suppressed) {
        setPosition(null)

        return
      }

      let frame = requestAnimationFrame(function step() {
        functions.syncPosition()
        frame = requestAnimationFrame(step)
      })

      const observer = new IntersectionObserver(([entry]) => {
        isClipped.current = !entry.isIntersecting
      })

      observer.observe(el)

      return () => {
        cancelAnimationFrame(frame)
        observer.disconnect()
        isClipped.current = false
      }
    }, [isActive, suppressed, functions])

    return (
      // フォーカス由来の表示を諦めるとキーボード操作でツールチップが読めなくなる
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      <span
        ref={wrapperRef}
        className={CLASS_NAMES.wrapper}
        onPointerEnter={functions.handleDelegatePointerEnter}
        onPointerLeave={functions.handleDelegatePointerLeave}
        onFocus={functions.handleDelegateFocusChange}
        onBlur={functions.handleDelegateFocusChange}
      >
        {children}
        {/*
        ポータルへ出しているのは、ツールバーの段が横スクロールのために overflow を持つため。
        段の中に置くと、スクロールしていない状態でもクリップされて見えない。
        mobile で描画を止めても、ボタンの aria-label と aria-keyshortcuts があるため
        支援技術への情報は失われない。
      */}
        {!suppressed &&
          !mobile &&
          position &&
          createPortal(
            <span
              className={CLASS_NAMES.tooltip[align]}
              style={{ top: position.top, left: position.left }}
              aria-hidden="true"
            >
              <span className={CLASS_NAMES.label}>{label}</span>
              {tokens.length > 0 && (
                // ラベルを1行目、キーを2行目に箱付きで並べる。
                // 箱で区切りが分かるため + は挟まない
                <span className={CLASS_NAMES.shortcutRow}>
                  {tokens.map((token, index) => (
                    <kbd key={`${token}-${index}`} className={CLASS_NAMES.key}>
                      {token}
                    </kbd>
                  ))}
                </span>
              )}
            </span>,
            document.body,
          )}
      </span>
    )
  },
)
