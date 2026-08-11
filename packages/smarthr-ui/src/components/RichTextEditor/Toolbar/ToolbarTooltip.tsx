'use client'

import { type FC, type ReactNode, memo } from 'react'
import { tv } from 'tailwind-variants'

import { useEnvironment } from '../../../hooks/useEnvironment'
import { useIsApplePlatform } from '../hooks/useIsApplePlatform'

import { formatShortcutTokens } from './shortcutKeys'

const classNameGenerator = tv({
  slots: {
    wrapper: 'shr-group shr-relative shr-inline-block',
    tooltip: [
      'shr-pointer-events-none shr-absolute shr-left-1/2 shr-top-full shr-z-overlap shr-mt-0.25',
      'shr-flex shr--translate-x-1/2 shr-flex-col shr-items-center shr-gap-0.25',
      'shr-whitespace-nowrap shr-rounded-m shr-bg-black shr-px-0.5 shr-py-0.5 shr-text-sm shr-text-white',
      'shr-opacity-0 shr-transition-opacity',
      'group-focus-within:shr-opacity-100 group-hover:shr-opacity-100',
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
})

const CLASS_NAMES = (() => {
  const { wrapper, tooltip, label, shortcutRow, key } = classNameGenerator()

  return {
    wrapper: wrapper(),
    tooltip: tooltip(),
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
  children: ReactNode
}

export const ToolbarTooltip: FC<Props> = memo(({ label, shortcut, suppressed, children }) => {
  const isApple = useIsApplePlatform()
  const { mobile } = useEnvironment()
  const tokens = shortcut ? formatShortcutTokens(shortcut, isApple) : []

  return (
    <span className={CLASS_NAMES.wrapper}>
      {children}
      {/*
        suppressed のときは opacity で隠すのではなく要素ごと描画しない。
        CSS の group-hover / group-focus-within より強い指定を重ねる必要がなくなる。

        mobile で描画しないのは、ツールバーの段が overflow-y-hidden を持つため。
        top-full で段の下に出るこのツールチップはクリップされて見えなくなる。
        ポータル化する手もあるが、タッチ環境ではホバーが無く元々表示されず、
        ボタンには aria-label があるため支援技術への情報も失われないため採らない。
      */}
      {!suppressed && !mobile && (
        <span aria-hidden="true" className={CLASS_NAMES.tooltip}>
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
        </span>
      )}
    </span>
  )
})
