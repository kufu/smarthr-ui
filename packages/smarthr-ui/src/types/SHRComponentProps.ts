import type {
  ComponentPropsWithRef,
  ComponentPropsWithoutRef,
  ComponentType,
  ElementType,
} from 'react'

type OptionsType = {
  as?: boolean
  omit?: PropertyKey
  required?: PropertyKey
  optional?: PropertyKey
}

type OmitKey<Options> = Options extends { omit: infer K extends PropertyKey } ? K : never
type AsOmitKey<Options> = Options extends { as: true } ? 'as' : never
type RequiredKey<Options> = Options extends { required: infer K extends PropertyKey } ? K : never
type OptionalKey<Options> = Options extends { optional: infer K extends PropertyKey } ? K : never

type AsProp<Options> = Options extends { as: true } ? { as?: string | ComponentType<any> } : object

// HINT: 標準のOmit(Pick<T, Exclude<keyof T, K>>)はkeyof Tがunion型の共通キーしか
// 見ないため、Baseがdiscriminated unionの場合に各メンバー固有のプロパティを失ってしまう。
// `T extends any ? ... : never` という条件型でBaseをunionのメンバーごとに分配してから
// Omitを適用することで、絞り込み後の個別プロパティを保持する。
// OverrideもBase同様discriminated unionになりうるため、omitの適用には同じ理由でDistributiveOmitを使う
type DistributiveOmit<T, K extends PropertyKey> = T extends any ? Omit<T, K> : never

// HINT: as・Override・Baseをすべて合成した後の型に対してrequired/optionalを適用する。
// 合成結果もdiscriminated unionになりうるため、DistributiveOmit同様distributiveに適用する。
// required/optionalに同じキーを指定した場合はrequired側が優先される(交差により必須の方が勝つ)
// `[...] extends [never]`でrequired/optionalいずれも未指定の場合はTをそのまま返す。
// これにより大多数を占めるrequired/optional不使用のケースで、素のBase & Overrideの形を保ち、
// 条件型の層を増やさない(ジェネリックコンポーネントの型引数推論への悪影響を避けるため)
type ApplyRequiredOptional<T, Options> = [RequiredKey<Options> | OptionalKey<Options>] extends [
  never,
]
  ? T
  : T extends any
    ? Omit<T, RequiredKey<Options> | OptionalKey<Options>> &
        Required<Pick<T, RequiredKey<Options> & keyof T>> &
        Partial<Pick<T, OptionalKey<Options> & keyof T>>
    : never

export type SHRComponentProps<
  Base,
  Override,
  Options extends OptionsType = object,
> = ApplyRequiredOptional<
  AsProp<Options> &
    DistributiveOmit<Override, AsOmitKey<Options> | OmitKey<Options>> &
    DistributiveOmit<Base, keyof Override | OmitKey<Options> | AsOmitKey<Options>>,
  Options
>

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
