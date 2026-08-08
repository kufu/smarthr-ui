'use client'

import { type FC, Fragment, type ReactNode, memo } from 'react'
import { tv } from 'tailwind-variants'

import { useIsApplePlatform } from '../hooks/useIsApplePlatform'

import { formatShortcutTokens } from './shortcutKeys'

const classNameGenerator = tv({
  slots: {
    wrapper: 'shr-group shr-relative shr-inline-block',
    tooltip: [
      'shr-pointer-events-none shr-absolute shr-left-1/2 shr-top-full shr-z-overlap shr-mt-0.25',
      'shr--translate-x-1/2 shr-whitespace-nowrap shr-rounded-m shr-bg-black shr-px-0.5 shr-py-0.25 shr-text-sm shr-text-white',
      'shr-opacity-0 shr-transition-opacity',
      'group-focus-within:shr-opacity-100 group-hover:shr-opacity-100',
    ],
    // ラベルと区別が付くよう少し弱める。black 背景に対して 13:1 あり基準は満たす
    shortcut: 'shr-ml-0.25 shr-text-white/80',
  },
})

const CLASS_NAMES = (() => {
  const { wrapper, tooltip, shortcut } = classNameGenerator()

  return {
    wrapper: wrapper(),
    tooltip: tooltip(),
    shortcut: shortcut(),
  }
})()

type Props = {
  label: string
  /** Tiptap 表記のショートカット（例: `Mod-B`）。未指定ならラベルのみ表示する */
  shortcut?: string
  /** true の間はホバー・フォーカスしてもツールチップを出さない */
  suppressed?: boolean
  children: ReactNode
}

export const ToolbarTooltip: FC<Props> = memo(({ label, shortcut, suppressed, children }) => {
  const isApple = useIsApplePlatform()
  const tokens = shortcut ? formatShortcutTokens(shortcut, isApple) : []

  return (
    <span className={CLASS_NAMES.wrapper}>
      {children}
      {/*
        suppressed のときは opacity で隠すのではなく要素ごと描画しない。
        CSS の group-hover / group-focus-within より強い指定を重ねる必要がなくなる。
      */}
      {!suppressed && (
        <span aria-hidden="true" className={CLASS_NAMES.tooltip}>
          {label}
          {tokens.length > 0 && (
            <span className={CLASS_NAMES.shortcut}>
              {tokens.map((token, index) => (
                <Fragment key={token}>
                  {/* Apple は記号を連結するのが慣習なので + を挟まない */}
                  {index > 0 && !isApple && '+'}
                  {/* kbd はブラウザ既定の等幅で描画され、ラベルと視覚的に区別できる */}
                  <kbd>{token}</kbd>
                </Fragment>
              ))}
            </span>
          )}
        </span>
      )}
    </span>
  )
})
