import type { FC, PropsWithChildren } from 'react'

/**
 * ブラウザの自動翻訳機能がテキストノードを別要素に置き換えた後も、Reactが安全にアンマウントできるようにするラッパー。
 *
 * 条件によってマウント/アンマウントされる対象が、要素でラップされていない生のテキスト
 * (文字列や `Localizer` など、実体としてテキストノードしか生成しないもの) かつ親の唯一の子でない場合、
 * ブラウザ翻訳後に React が `removeChild`/`insertBefore` で例外を起こしクラッシュする。
 * このコンポーネントで包むことで、React が増減させる対象を常に存在し続ける要素ノードにする。
 *
 * 詳細・適用すべき箇所の判断基準は AGENTS.md を参照。
 * @see https://github.com/facebook/react/issues/11538
 */
export const SafeBrowserTranslation: FC<PropsWithChildren> = ({ children }) => (
  <span>{children}</span>
)
