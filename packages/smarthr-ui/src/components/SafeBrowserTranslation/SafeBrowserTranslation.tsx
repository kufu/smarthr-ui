/**
 * ブラウザの自動翻訳機能がテキストノードを別要素に置き換えた後も、Reactが安全にアンマウントできるようにするラッパー。
 *
 * 条件によってマウント/アンマウントされる対象が、要素でラップされていない生のテキスト
 * (`Localizer` など、実体としてテキストノードしか生成しないコンポーネント) の場合、
 * ブラウザ翻訳後に React が `removeChild`/`insertBefore` で例外を起こしクラッシュする。
 * 親要素の唯一の子であっても安全にはならない(Reactが例外を起こさないのは、文字列・数値
 * リテラルを親要素の直下に単独で置く場合のみ)。このコンポーネントで包むことで、React が
 * 増減させる対象を常に存在し続ける要素ノードにする。
 *
 * 詳細・適用すべき箇所の判断基準は AGENTS.md を参照。
 * @see https://github.com/facebook/react/issues/11538
 */
export const SafeBrowserTranslation = 'span' as const
