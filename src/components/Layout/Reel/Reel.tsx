import React, { PropsWithChildren } from 'react'
import { tv } from 'tailwind-variants'

import type { Gap } from '../../../types'

const reel = tv({
  /* 
    `empty:gap-0` について
    Chromeで空の要素にflex-gapがあると印刷時にレイアウトが崩れるので gap の値を0にする
    See https://bugs.chromium.org/p/chromium/issues/detail?id=1161709
  */
  base: 'empty:gap-0 shr-flex shr-overflow-x-auto shr-overflow-y-hidden [&>*]:shr-flex-[0_0_auto]',
  variants: {
    gap: {
      // 動的生成も考えたが、tailwindcss が検知できないためベタ書きしている
      0: 'shr-gap-0',
      0.25: 'shr-gap-0.25',
      0.5: 'shr-gap-0.5',
      0.75: 'shr-gap-0.75',
      1: 'shr-gap-1',
      1.25: 'shr-gap-1.25',
      1.5: 'shr-gap-1.5',
      2: 'shr-gap-2',
      2.5: 'shr-gap-2.5',
      3: 'shr-gap-3',
      3.5: 'shr-gap-3.5',
      4: 'shr-gap-4',
      8: 'shr-gap-8',
      '-0.25': '-shr-gap-0.25',
      '-0.5': '-shr-gap-0.5',
      '-0.75': '-shr-gap-0.75',
      '-1': '-shr-gap-1',
      '-1.25': '-shr-gap-1.25',
      '-1.5': '-shr-gap-1.5',
      '-2': '-shr-gap-2',
      '-2.5': '-shr-gap-2.5',
      '-3': '-shr-gap-3',
      '-3.5': '-shr-gap-3.5',
      '-4': '-shr-gap-4',
      '-8': '-shr-gap-8',
      X3S: 'shr-gap-0.25',
      XXS: 'shr-gap-0.5',
      XS: 'shr-gap-1',
      S: 'shr-gap-1.5',
      M: 'shr-gap-2',
      L: 'shr-gap-2.5',
      XL: 'shr-gap-3',
      XXL: 'shr-gap-3.5',
      X3L: 'shr-gap-4',
    } as { [key in Gap]: string },
    padding: {
      0: 'shr-p-0',
      0.25: 'shr-p-0.25',
      0.5: 'shr-p-0.5',
      0.75: 'shr-p-0.75',
      1: 'shr-p-1',
      1.25: 'shr-p-1.25',
      1.5: 'shr-p-1.5',
      2: 'shr-p-2',
      2.5: 'shr-p-2.5',
      3: 'shr-p-3',
      3.5: 'shr-p-3.5',
      4: 'shr-p-4',
      8: 'shr-p-8',
      '-0.25': '-shr-p-0.25',
      '-0.5': '-shr-p-0.5',
      '-0.75': '-shr-p-0.75',
      '-1': '-shr-p-1',
      '-1.25': '-shr-p-1.25',
      '-1.5': '-shr-p-1.5',
      '-2': '-shr-p-2',
      '-2.5': '-shr-p-2.5',
      '-3': '-shr-p-3',
      '-3.5': '-shr-p-3.5',
      '-4': '-shr-p-4',
      '-8': '-shr-p-8',
      X3S: 'shr-p-0.25',
      XXS: 'shr-p-0.5',
      XS: 'shr-p-1',
      S: 'shr-p-1.5',
      M: 'shr-p-2',
      L: 'shr-p-2.5',
      XL: 'shr-p-3',
      XXL: 'shr-p-3.5',
      X3L: 'shr-p-4',
    } as { [key in Gap]: string },
  },
})

type Props = PropsWithChildren<{
  /** 間隔の指定（基準フォントサイズの相対値または抽象値） */
  gap?: Gap
  padding?: Gap
}>

export const Reel: React.FC<Props> = ({ gap = 0.5, padding = 0, children }) => (
  <div className={reel({ gap, padding })}>{children}</div>
)
