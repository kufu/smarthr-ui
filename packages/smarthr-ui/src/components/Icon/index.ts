// eslint-disable-next-line no-restricted-syntax -- FaIconから202個のアイコンをexport
export * from './FaIcon'
export {
  /** @public */
  generateIcon,
  // TODO: smarthr-uiは型を公開APIとして提供しない方針のため、本来この型はexport
  // すべきではない。また`ComponentProps`という名前も汎用的すぎる。現状AppNavi系・
  // BottomFixedAreaの複数箇所がicon propsの型として利用しており、exportの廃止・
  // 名前の変更いずれも破壊的変更になるため、別途対応する
  type Props as ComponentProps,
} from './generateIcon'

/** @public */
export { WarningIcon } from './WarningIcon'
/** @public */
export { SparklesIcon } from './SparklesIcon'
export { LanguageIcon } from './LanguageIcon'
export { OpenInNewTabIcon } from './OpenInNewTabIcon'
export { StatusIcon } from './StatusIcon'
