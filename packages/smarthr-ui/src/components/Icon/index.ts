// eslint-disable-next-line no-restricted-syntax -- FaIconから202個のアイコンをexport
export * from './FaIcon'
// HINT: smarthr-uiは型を公開APIとして提供しない方針のため、Props型はexportしない。
// アイコンに渡せるpropsの型が必要な場合はComponentPropsWithRef<ReturnType<typeof generateIcon>>で導出する
/** @public */
export { generateIcon } from './generateIcon'

/** @public */
export { WarningIcon } from './WarningIcon'
/** @public */
export { SparklesIcon } from './SparklesIcon'
export { LanguageIcon } from './LanguageIcon'
export { OpenInNewTabIcon } from './OpenInNewTabIcon'
export { StatusIcon } from './StatusIcon'
