import type {
  ComponentPropsWithRef,
  ComponentPropsWithoutRef,
  ComponentType,
  ElementType,
} from 'react'

type OptionsType = { as?: boolean; omit?: PropertyKey }

type OmitKey<Options> = Options extends { omit: infer K extends PropertyKey } ? K : never
type AsOmitKey<Options> = Options extends { as: true } ? 'as' : never

type AsProp<Options> = Options extends { as: true } ? { as?: string | ComponentType<any> } : object

// HINT: 標準のOmit(Pick<T, Exclude<keyof T, K>>)はkeyof Tがunion型の共通キーしか
// 見ないため、Baseがdiscriminated unionの場合に各メンバー固有のプロパティを失ってしまう。
// `T extends any ? ... : never` という条件型でBaseをunionのメンバーごとに分配してから
// Omitを適用することで、絞り込み後の個別プロパティを保持する。
// OverrideもBase同様discriminated unionになりうるため、omitの適用には同じ理由でDistributiveOmitを使う
type DistributiveOmit<T, K extends PropertyKey> = T extends any ? Omit<T, K> : never

export type SHRComponentProps<
  Base,
  Override,
  Options extends OptionsType = object,
> = AsProp<Options> &
  DistributiveOmit<Override, AsOmitKey<Options> | OmitKey<Options>> &
  DistributiveOmit<Base, keyof Override | OmitKey<Options>>

export type SHRComponentPropsWithRef<
  Base extends ElementType,
  Override,
  Options extends OptionsType = object,
> = SHRComponentProps<ComponentPropsWithRef<Base>, Override, Options>

export type SHRComponentPropsWithoutRef<
  Base extends ElementType,
  Override,
  Options extends OptionsType = object,
> = SHRComponentProps<ComponentPropsWithoutRef<Base>, Override, Options>
