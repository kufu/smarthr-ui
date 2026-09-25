// eslint-disable-next-line smarthr/require-barrel-import -- Storybook 専用。本番の tailwind.config と同じプリセットを参照する。
import preset from '../src/smarthr-ui-preset'

import type { Config } from 'tailwindcss'

/**
 * Storybook のみ。`@smarthr/smarthr-ui-charts` のストーリー用クラスを含め、本番 `smarthr-ui.css` の content には含めない。
 *
 * `content.relative: true` がないと、`../src` 等が **カレントディレクトリ**基準で解決され、
 * `packages/smarthr-ui` で起動したとき `../src` → `packages/src`（存在しない）となり JIT がファイルを一切見つけられない。
 * `true` にするとパスは **この設定ファイルのあるディレクトリ**（`.storybook/`）基準になる。
 *
 * @see https://tailwindcss.com/docs/content-configuration
 */
export default {
  presets: [preset],
  content: {
    relative: true,
    files: ['../src/**/*.{js,jsx,ts,tsx}', '../../charts/src/**/*.{js,jsx,ts,tsx}'],
  },
} satisfies Config
