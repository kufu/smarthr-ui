import { createTV } from 'tailwind-variants'

const WIDTH_KEYS = Array.from({ length: 12 }, (_, i) => `col${i + 1}`)

const isArbitraryValue = (classPart: string) => /^\[.+\]$/.test(classPart)

/**
 * smarthr-ui 本体の configureTwMerge と同じ設定を持つ tv。
 *
 * 本体は tailwind-variants の defaultConfig をモジュールの副作用で書き換えるが、ビルド成果物は
 * tailwind-variants を同梱しており、書き換わるのは同梱した方になる。エディタが node_modules から
 * 読む tailwind-variants には届かず、shr- 接頭辞のクラス同士の衝突が解決されない。
 * 本体から設定を取り込む公開の口は無く、本体を読み込むと /viewer も重くなるため、設定を写して持つ。
 * 本体の設定を変えたらここも揃える。
 */
export const tv = createTV({
  twMergeConfig: {
    prefix: 'shr-',
    classGroups: {
      w: [{ w: [...WIDTH_KEYS, isArbitraryValue] }],
      basis: [{ basis: [...WIDTH_KEYS, isArbitraryValue] }],
      boxShadow: [
        {
          shadow: [
            'layer-0',
            'layer-1',
            'layer-2',
            'layer-3',
            'layer-4',
            'outline',
            'underline',
            'input-hover',
            'none',
          ],
        },
      ],
      'border-shorthand': [
        'border-shorthand',
        'border-t-shorthand',
        'border-r-shorthand',
        'border-b-shorthand',
        'border-l-shorthand',
      ],
      fontSize: [{ text: ['2xs', 'xs', 'sm', 'base', 'lg', 'xl', '2xl', 'inherit'] }],
      lineHeight: [{ leading: ['none', 'tight', 'normal', 'loose', '[0]'] }],
      zIndex: [
        {
          z: [
            'auto',
            '0',
            '1',
            'fixed-menu',
            'overlap-base',
            'overlap',
            (classPart: string) => /^\[\d+\]$/.test(classPart),
          ],
        },
      ],
      focus: ['focus-indicator', 'focus-indicator--outer', 'focus-indicator-none'],
    },
  },
})
