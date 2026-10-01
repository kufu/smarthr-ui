export type { Gap, PositiveGap, SeparatePositiveGap } from './Gap'
// HINT: Cluster/Sidebarのgap propがSeparatePositiveGapに置き換わり、smarthr-ui内では未使用。
// smarthr-design-systemがsmarthr-ui/typesから直接importする実質専用の型のため、
// 公開型として維持する。smarthr-design-system側でも未使用であることが確認できたら削除してよい
/** @public */
export type { SeparateGap } from './Gap'
export type { ElementRef, ElementRefProps } from './ComponentTypes'
export type { ResponseStatus, ResponseStatusWithoutProcessing } from '../hooks/useResponseStatus'
