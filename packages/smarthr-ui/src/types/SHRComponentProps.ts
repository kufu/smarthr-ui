import type { ComponentPropsWithRef, ComponentPropsWithoutRef, ElementType } from 'react'

type OmitKey<Options> = Options extends { omit: infer K extends PropertyKey } ? K : never

// HINT: 標準のOmit(Pick<T, Exclude<keyof T, K>>)はkeyof Tがunion型の共通キーしか
// 見ないため、Baseがdiscriminated unionの場合に各メンバー固有のプロパティを失ってしまう。
// `T extends any ? ... : never` という条件型でBaseをunionのメンバーごとに分配してから
// Omitを適用することで、絞り込み後の個別プロパティを保持する
type DistributiveOmit<T, K extends PropertyKey> = T extends any ? Omit<T, K> : never

export type SHRComponentProps<
  Base,
  Override,
  Options extends { omit?: PropertyKey } = object,
> = Override & DistributiveOmit<Base, keyof Override | OmitKey<Options>>

export type SHRComponentPropsWithRef<
  Base extends ElementType,
  Override,
  Options extends { omit?: PropertyKey } = object,
> = SHRComponentProps<ComponentPropsWithRef<Base>, Override, Options>

export type SHRComponentPropsWithoutRef<
  Base extends ElementType,
  Override,
  Options extends { omit?: PropertyKey } = object,
> = SHRComponentProps<ComponentPropsWithoutRef<Base>, Override, Options>
